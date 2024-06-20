import { LGraphNode, LiteGraph } from "litegraph.js";
import { AgentFunctionInfoDictionary, AgentFunctionInfo } from "graphai";

type AgentData = {
  name: string;
  category: string;
  inputs?: string[][];
  outputs?: string[][];
};

LiteGraph.registered_node_types = {};
LiteGraph.searchbox_extras = {};

const createAgentNode = (agentData: AgentData) => {
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
};

const jsonSchemaToIO = (inputs: any, typeName: string) => {
  if (!inputs) {
    return [[typeName, ["string", "number", "object"]]];
  }
  if (inputs.type === "object") {
    return Object.keys(inputs.properties).map((property) => {
      return [property, inputs.properties[property].type];
    });
  }
  if (inputs.anyOf) {
    return [[typeName, inputs.anyOf.map((a: { type: string }) => a.type)]];
  }
  return [[typeName, "string"]];
};

const inputs2inputs = (inputs: any) => {
  return jsonSchemaToIO(inputs, "In");
};
const outputs2outputs = (outputs: any) => {
  return jsonSchemaToIO(outputs, "Output");
};

const jsonSchemaToI2IOType = (inputs: any) => {
  if (!inputs) {
    return [];
  }
  if (inputs.type === "object") {
    return Object.keys(inputs.properties);
  }
  return [];
};

const setAgentToLiteGraph = (agents: AgentFunctionInfoDictionary) => {
  [
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
    {
      name: "number",
      category: "static",
      outputs: [["Output", "number"]],
    },
    {
      name: "string",
      category: "static",
      outputs: [["Output", "string"]],
    },
  ].map((agent: AgentData) => {
    LiteGraph.registerNodeType([agent.category, agent.name].join("/"), createAgentNode(agent));
  });

  const lite2agent: Record<string, AgentFunctionInfo> = {};
  const lite2inputs: Record<string, string[]> = {};
  const lite2output: Record<string, string[]> = {};

  Object.values(agents).map((agent) => {
    if (agent.category) {
      agent.category.forEach((category) => {
        const name = agent.name.replace(/Agent$/, "");
        const nodeType = [category, name].join("/");
        lite2inputs[nodeType] = jsonSchemaToI2IOType(agent.inputs);
        lite2output[nodeType] = jsonSchemaToI2IOType(agent.output);
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
  return { lite2agent, lite2inputs, lite2output };
};

export { LiteGraph, setAgentToLiteGraph };
