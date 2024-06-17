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
      this.addWidget("text", "system", "11");
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

  Object.values(vanillaAgents).map((agent) => {
    if (agent.category) {
      agent.category.forEach((category) => {
        const name = agent.name.replace(/Agent$/, "");
        console.log(inputs2inputs(agent.inputs));
        LiteGraph.registerNodeType(
          [category, name].join("/"),
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
};

export { LiteGraph, initLiteGraph };
