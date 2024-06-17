import { LGraphNode, LiteGraph } from "litegraph.js";

type AgentData = {
  cname: string;
  name: string;
  nodeName: string;
  inputs?: string[][];
  outputs?: string[][];
};
function createAgentNode(agentData: AgentData) {
  class DynamicSubclass extends LGraphNode {
    constructor() {
      super(agentData.name);
      (this as any).className = agentData.cname;
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
      // this.properties = { precision: 1 };
    }
  }

  Object.defineProperty(DynamicSubclass, "name", { value: agentData.cname });

  return DynamicSubclass;
}

LiteGraph.registered_node_types = {};
LiteGraph.searchbox_extras = {};

const initLiteGraph = () => {
  [
    {
      cname: "BasicSumAgent",
      name: "Sum",
      nodeName: "basic/sum",
      inputs: [
        ["A", "number"],
        ["B", "number"],
      ],
      outputs: [["A+B", "number"]],
    },
    {
      cname: "StringInputNode",
      name: "StringInput",
      nodeName: "basic/stringInput",
      outputs: [["Output", "string"]],
    },
    {
      cname: "TextInputAgentNode",
      name: "TextInput",
      nodeName: "graphai/TextInputAgent",
      outputs: [["Output", "string"]],
    },
    {
      cname: "OpenAIAgentNode",
      name: "OpenAI",
      nodeName: "graphai/OpenAIAgent",
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
      cname: "StringTemplateAgentNode",
      name: "StringTemplate",
      nodeName: "graphai/StringTemplateAgent",
      inputs: [["${0}", "string"]],
      outputs: [["Output", "string"]],
    },
    {
      cname: "PropertyFilterAgentNode",
      name: "PropertyFilter",
      nodeName: "graphai/PropertyFilterAgent",
      inputs: [["In", "string"]],
      outputs: [["Output", "string"]],
    },
  ].map((agent: AgentData) => {
    LiteGraph.registerNodeType(agent.nodeName, createAgentNode(agent));
  });
};

export { LiteGraph, initLiteGraph };

