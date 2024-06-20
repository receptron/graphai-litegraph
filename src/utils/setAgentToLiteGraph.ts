import { LGraphNode, LiteGraph } from "litegraph.js";
import { AgentFunctionInfoDictionary, AgentFunctionInfo } from "graphai";

type AgentData = {
  name: string;
  category: string;
  inputs?: string[][];
  outputs?: string[][];
  params?: any;
};

LiteGraph.registered_node_types = {};
LiteGraph.searchbox_extras = {};

const createAgentNode = (agentData: AgentData) => {
  class DynamicAgentClass extends LGraphNode {
    serialize_widgets = true;
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
      if (agentData.params && agentData.params.properties) {
        Object.keys(agentData.params.properties).forEach((key) => {
          const data = agentData.params.properties[key];
          if (data.type === "string") {
            this.addWidget("text", key, "");
          } else if (data.type === "number") {
            this.addWidget("number", key, "");
          } else if (data.type === "boolean") {
            this.addWidget("toggle", key, false);
          } else {
            // this.addWidget("boolean", key, "");
            console.log(key, data);
          }
        });
        // this.addWidget("text", "Text", "multiline", function () {}, { multiline: true });
      }
      if (agentData.category === "static") {
        if (agentData.name === "string") {
          this.addWidget("text", "value", "");
        }
        if (agentData.name === "number") {
          this.addWidget("number", "value", "");
        }
      }
    }
  }

  Object.defineProperty(DynamicAgentClass, "name", { value: agentData.name });

  return DynamicAgentClass;
};

const jsonSchemaToIO = (inputs: any, typeName: string) => {
  if (!inputs) {
    return [[typeName, ["string", "number", "object"]]];
  }
  if (inputs.type === "object" && inputs.properties) {
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

const format2output = (format: any) => {
  return Object.keys(format).map((property) => {
    const data = format[property];
    return [property, data.type];
  });
};

const jsonSchemaToI2IOType = (inputs: any) => {
  if (!inputs) {
    return [];
  }
  if (inputs.type === "object" && inputs.properties) {
    return Object.keys(inputs.properties);
  }
  return [];
};
const format2output2 = (format: any) => {
  return Object.keys(format).map((property) => {
    const data = format[property];
    return data.key;
  });
};

const params2widget = (params: any) => {
  if (params && params.properties) {
    return Object.keys(params.properties)
      .map((key) => {
        const data = params.properties[key];
        if (data.type === "string") {
          return {
            type: "string",
            key,
          };
        }
        if (data.type === "boolean") {
          return {
            type: "boolean",
            key,
          };
        }
        if (data.type === "number") {
          return {
            type: "number",
            key,
          };
        }
      })
      .filter((a) => a) as any[];
  }
  return [];
};

const setAgentToLiteGraph = (agents: AgentFunctionInfoDictionary) => {
  [
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
  const lite2params: Record<string, { type: string; key: string }[]> = {};

  // TODO remove any after add format to AgentFunctionInfo
  Object.values(agents).map((agent: any) => {
    if (agent.category) {
      agent.category.forEach((category: any) => {
        const name = agent.name.replace(/Agent$/, "");
        const nodeType = [category, name].join("/");
        lite2inputs[nodeType] = jsonSchemaToI2IOType(agent.inputs);
        lite2output[nodeType] = agent.format ? format2output2(agent.format) : jsonSchemaToI2IOType(agent.output);
        lite2agent[nodeType] = agent;
        lite2params[nodeType] = params2widget(agent.params);
        LiteGraph.registerNodeType(
          nodeType,
          createAgentNode({
            name: name,
            category: category,
            inputs: inputs2inputs(agent.inputs),
            outputs: agent.format ? format2output(agent.format) : outputs2outputs(agent.output),
            params: agent.params,
          }),
        );
      });
    }
  });
  return { lite2agent, lite2inputs, lite2output, lite2params };
};

export { LiteGraph, setAgentToLiteGraph };
