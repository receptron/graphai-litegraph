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
    }
  }

  Object.defineProperty(DynamicSubclass, "name", { value: agentData.name });

  return DynamicSubclass;
}

LiteGraph.registered_node_types = {};
LiteGraph.searchbox_extras = {};

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
      name: "StringInput",
      category: "basic",
      outputs: [["Output", "string"]],
    },
    {
      name: "TextInput",
      category: "graphai",
      outputs: [["Output", "string"]],
    },
    {
      name: "OpenAI",
      category: "graphai",
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
    {
      name: "StringTemplate",
      category: "graphai",
      inputs: [["${0}", "string"]],
      outputs: [["Output", "string"]],
    },
    {
      name: "PropertyFilter",
      category: "graphai",
      inputs: [["In", "string"]],
      outputs: [["Output", "string"]],
    },
  ].map((agent: AgentData) => {
    LiteGraph.registerNodeType([agent.category, agent.name].join("/"), createAgentNode(agent));
  });

  Object.values(vanillaAgents).map((agent) => {
    if (agent.category) {
      agent.category.forEach((category) => {
        const name = agent.name.replace(/Agent$/, "")
        LiteGraph.registerNodeType(
          [category, name].join("/"),
          createAgentNode({
            name: name,
            category: category,
            inputs: [["In", "string"]],
            outputs: [["Output", "string"]],
          }),
        );
      });
    }
  });
};

export { LiteGraph, initLiteGraph };
