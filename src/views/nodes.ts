import { LGraphNode } from "litegraph.js";

type AgentData = {
  cname: string;
  name: string;
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

const ret = [
  {
    cname: "BasicSumAgent",
    name: "Sum",
    inputs: [
      ["A", "number"],
      ["B", "number"],
    ],
    outputs: [["A+B", "number"]],
  },
  {
    cname: "StringInputNode",
    name: "StringInput",
    outputs: [["Output", "string"]],
  },
  {
    cname: "TextInputAgentNode",
    name: "TextInput",
    outputs: [["Output", "string"]],
  },
  {
    cname: "OpenAIAgentNode",
    name: "OpenAI",
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
  { cname: "StringTemplateAgentNode", name: "StringTemplate", inputs: [["${0}", "string"]], outputs: [["Output", "string"]] },
  { cname: "PropertyFilterAgentNode", name: "PropertyFilter", inputs: [["In", "string"]], outputs: [["Output", "string"]] },
].reduce((tmp: Record<string, new () => LGraphNode>, agent: AgentData) => {
  tmp[agent.cname] = createAgentNode(agent);
  return tmp;
}, {});
export default ret; 
