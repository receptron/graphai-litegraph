import { ComputedNodeData } from "graphai";
import { LGraphNode, LiteGraph } from "litegraph.js";
import * as vanillaAgents from "@graphai/vanilla";

type AgentData = {
  name: string;
  category: string;
  inputs?: string[][];
  outputs?: string[][];
};

function createAgentNode(agentData: AgentData) {
  class DynamicSubclass extends LGraphNode {
    constructor() {
      super(agentData.name);
      (this as any).className = agentData.name;
      if (agentData.inputs) {
        agentData.inputs.forEach((input) => {
          this.addInput(input[0], input[1]);
        });
      }
      if (agentData.outputs) {
        agentData.outputs.forEach((output) => {
          this.addOutput(output[0], output[1]);
        });
      }
      this.addWidget("text", "hoge", "11");
      this.addWidget("text", "Text", "multiline", function () {}, { multiline: true });
      this.addWidget("text", "system", "11");
    }
  }

  Object.defineProperty(DynamicSubclass, "name", { value: agentData.name });

  return DynamicSubclass;
}

LiteGraph.registered_node_types = {};
LiteGraph.searchbox_extras = {};

const inputs2inputs = (inputs: any) => {
  if (!inputs) {
    return [["In", ["string", "number", "object"]]];
  }
  if (inputs.type === "object") {
    return Object.keys(inputs.properties).map((property) => {
      return [property, inputs.properties[property].type];
    });
  }
  if (inputs.anyOf) {
    return [["In", inputs.anyOf.map((a: { type: string }) => a.type)]];
  }
  return [["In", "string"]];
};

const outputs2outputs = (outputs: any) => {
  if (!outputs) {
    return [["Output", "string"]];
  }
  if (outputs.type === "object") {
    return Object.keys(outputs.properties).map((property) => {
      //console.log()
      return [property, outputs.properties[property].type];
    });
  }
  return [["Output", ["string", "number", "object"]]];
};

const initLiteGraph = () => {
  [
    {
      name: "BasicSum",
      category: "basic",
      inputs: [
        ["A", "number"],
        ["B", "number"],
      ],
      outputs: [["A+B", "number"]],
    },
    {
      name: "OpenAI",
      category: "llm",
      inputs: [
        ["prompt", "string"],
        ["model", "string"],
        ["system", "string"],
        ["baseUrl", "string"],
      ],
      outputs: [
        ["Output", "object"],
        [".choices.$0.message.content", "string"],
      ],
    },
  ].map((agent: AgentData) => {
    LiteGraph.registerNodeType([agent.category, agent.name].join("/"), createAgentNode(agent));
  });

  const lite2agent: Record<string, any> = {};
  Object.values(vanillaAgents).map((agent) => {
    if (agent.category) {
      agent.category.forEach((category) => {
        const name = agent.name.replace(/Agent$/, "");
        console.log(inputs2inputs(agent.inputs));
        const nodeType = [category, name].join("/");
        lite2agent[nodeType] = agent;
        LiteGraph.registerNodeType(
          nodeType,
          createAgentNode({
            name: name,
            category: category,
            inputs: inputs2inputs(agent.inputs),
            outputs: outputs2outputs(agent.output),
          }),
        );
      });
    }
  });
  return { lite2agent };
};

const liteGraph2GraphData = (liteGraph: any, lite2agent: any) => {
  // [link index, out node, out position, in node, in position]かな。
  const linkObj = liteGraph.links.reduce((tmp: Record<string, string[]>, link: string[]) => {
    if (tmp[link[3]] === undefined) {
      tmp[link[3]] = [];
    }
    tmp[link[3]].push(link[1])
    return tmp;
  }, {});
  // console.log(linkObj);
  
  const nodes = liteGraph.nodes.reduce((tmp: Record<string, ComputedNodeData>, node: any) => {
    // [link index, out node, out position, in node, in position]
    // innode, inputs [out node]
    const inputs = linkObj[node.id];
    const agent = lite2agent[node.type];
    tmp[`node_${node.id}`] = {
      agent: agent ? agent.name : node.type,
      inputs: inputs ? inputs.map((id: string) => `node_${id}`) : undefined,
    }
    return tmp;
  }, {});
  console.log(nodes);
  console.log(liteGraph, lite2agent);
};

export { LiteGraph, initLiteGraph, liteGraph2GraphData };
