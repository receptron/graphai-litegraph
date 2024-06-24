import { ref, computed } from "vue";
import { AgentFunctionContext, GraphAI, AgentFunctionInfoDictionary } from "graphai";

import { streamAgentFilterGenerator, httpAgentFilter } from "@graphai/agent_filters";
import { ExpressAgentInfo } from "@receptron/graphai_express_type";

const getAgentFilter = <T>(
  serverAgentUrlDictionary: Record<string, string>,
  serverAgentIds: string[],
  streamAgentIds: string[],
  callback: (context: AgentFunctionContext, data: T) => void,
) => {
  const streamAgentFilter = streamAgentFilterGenerator(callback);
  const agentFilters = [
    {
      name: "streamAgentFilter",
      agent: streamAgentFilter,
      agentIds: streamAgentIds,
    },
    {
      name: "httpAgentFilter",
      agent: httpAgentFilter,
      filterParams: {
        server: {
          serverAgentUrlDictionary,
        },
      },
      agentIds: serverAgentIds,
    },
  ];
  return agentFilters;
};

const useServerAgent = (agentBaseUrls: string[]) => {
  const serverAgentUrlDictionary: Record<string, string> = {};
  const getServerAgents = async (url: string) => {
    const response = await fetch(url);
    return await response.json();
  };

  const serverAgentsInfoDictionary = ref<Record<string, ExpressAgentInfo>>({});

  agentBaseUrls.forEach(async (url) => {
    try {
      const res = await getServerAgents(url);
      serverAgentsInfoDictionary.value = res.agents.reduce((tmp: Record<string, ExpressAgentInfo>, a: ExpressAgentInfo) => {
        if (tmp[a.agentId]) {
          console.log("duplicate agent: " + a.agentId);
        }
        serverAgentUrlDictionary[a.agentId] = url + "/" + a.agentId;
        tmp[a.agentId] = a;
        return tmp;
      }, {});
    } catch (e) {
      alert("server(" + url + ") may be down. check server or use https://github.com/receptron/graphai-agent-server");
    }
  });

  const serverAgentIds = computed(() => {
    return (
      Object.keys(serverAgentsInfoDictionary.value).map((key: string) => {
        return serverAgentsInfoDictionary.value[key].agentId;
      }) ?? []
    );
  });
  return { serverAgentsInfoDictionary, serverAgentIds, serverAgentUrlDictionary };
};

const useStreamingData = () => {
  const streamingData = ref<Record<string, unknown>>({});
  const callback = (context: AgentFunctionContext, data: string) => {
    const { nodeId } = context.debugInfo;
    streamingData.value[nodeId] = (streamingData.value[nodeId] ?? "") + data;
  };
  return { streamingData, callback };
};

export const useGraph = (agentUrls: string[], clientAgents: AgentFunctionInfoDictionary) => {
  const graphResult = ref<Record<string, any>>({});

  const { serverAgentsInfoDictionary, serverAgentIds, serverAgentUrlDictionary } = useServerAgent(agentUrls);

  const streamAgentIds = computed(() => {
    return [
      ...Object.values(serverAgentsInfoDictionary.value)
        .filter((a) => a.stream)
        .map((a) => a.agentId),
      ...Object.values(clientAgents)
        .filter((a) => a.stream)
        .map((a) => a.name),
    ];
  });

  const { streamingData, callback } = useStreamingData();
  const getGraph = (graphData: any) => {
    const agentFilters = getAgentFilter(serverAgentUrlDictionary, serverAgentIds.value, streamAgentIds.value, callback);
    graphResult.value = {};
    streamingData.value = {};
    console.log(clientAgents);
    return new GraphAI(graphData, clientAgents, { agentFilters, bypassAgentIds: serverAgentIds.value });
  };

  return {
    getGraph,
    streamingData,
    graphResult,
    serverAgentIds,
    serverAgentsInfoDictionary,
  };
};
