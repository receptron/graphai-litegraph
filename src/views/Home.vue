<template>
  <div class="home">
    <div class="flex items-center justify-center space-x-8">
      <!-- Use Tailwind CSS h-40 (=10rem=160px) instead of .logo. -->
      <canvas id="mycanvas" width="1024" height="720" style="border: 1px solid" ref="canvasRef"></canvas>
    </div>
    <div>
      <button @click="save" class="border-2 border-blue-200">Save</button>
      <button @click="load" class="border-2 border-blue-200">Load</button>
      <button @click="reset" class="border-2 border-blue-200">Reset</button>
      <button @click="download" class="border-2 border-blue-200">Download</button>
      <button @click="runGraph" class="border-2 border-blue-200">Run</button>
    </div>
    <div>
      {{ streamingData }}
      {{ graphResult }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

import { LGraph, LGraphCanvas } from "litegraph.js";
import "litegraph.js/css/litegraph.css";

import { liteGraph2GraphData } from "../utils/toGraphAi";
import { LiteGraph, setAgentToLiteGraph } from "../utils/setAgentToLiteGraph";

// import { GraphAI } from "graphai";

import * as vanillaAgents from "@graphai/vanilla";
import * as sleeperAgents from "@graphai/sleeper_agents";
import * as dataAgents from "@graphai/data_agents"
// import { agentlist } from "../utils/agentlist";
import { defaultData } from "../utils/defaultData";
import { useGraph } from "../utils/graph";

export default defineComponent({
  name: "HomePage",
  components: {},
  setup() {
    const canvasRef = ref();

    let lite2graph = {};
    let liteGraph: LGraph | undefined = undefined;
    const webAgents = { ...vanillaAgents,  ...sleeperAgents, ...dataAgents };
    const {
      getGraph,
      streamingData,
      graphResult,
      serverAgentsInfoDictionary,
    } = useGraph(["http://localhost:8085/agents"], webAgents);

    watch([canvasRef, serverAgentsInfoDictionary], (v) => {
      if (v[0] && v[1] && Object.keys(v[1]).length > 0) {
        const agents = [...Object.values(serverAgentsInfoDictionary.value), ...Object.values(webAgents)].reduce((tmp: any, agent) => {
          tmp[agent.agentId ?? agent.name] = agent;
          return tmp;
        }, {});
        lite2graph = setAgentToLiteGraph(agents);
        liteGraph = new LiteGraph.LGraph();
        
        new LGraphCanvas(canvasRef.value, liteGraph);
        liteGraph.start();
        if (!load()) {
          liteGraph.configure(defaultData);
        }
      }
    });
    
    const download = () => {
      const data = liteGraph.serialize();
      console.log(JSON.stringify(data));
      const graphData = liteGraph2GraphData(data, lite2graph as any);
      console.log(graphData);
      console.log(JSON.stringify(graphData, undefined, 2));
    };
    const localStorageKey = "graphai-litegraph-data";

    const save = () => {
      const data = liteGraph.serialize();
      localStorage.setItem(localStorageKey, JSON.stringify(data));
    };
    const load = () => {
      const graphString = localStorage.getItem(localStorageKey);
      if (graphString) {
        const data = JSON.parse(graphString);
        liteGraph.configure(data);
      }
      return !!graphString;
    };
    const reset = () => {
      liteGraph.configure(defaultData);
    };
    const runGraph = async () => {
      const data = liteGraph.serialize();
      const graphData = liteGraph2GraphData(data, lite2graph as any);
      const graphAI = getGraph(graphData);
      const res = await graphAI.run(true);
      graphResult.value = res;
      console.log(res);
    };
    return {
      download,
      canvasRef,
      save,
      load,
      reset,
      runGraph,

      streamingData,
      graphResult,
    };
  },
});
</script>
