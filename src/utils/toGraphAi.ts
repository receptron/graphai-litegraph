import { ComputedNodeData, AgentFunctionInfo } from "graphai";
import { serializedLGraph, LGraphNode } from "litegraph.js";

const liteGraph2GraphData = (liteGraph: serializedLGraph, lite2agent: Record<string, AgentFunctionInfo>, lite2inputs: Record<string, string[]>, lite2output: Record<string, string[]>) => {

  const inputTypes = liteGraph.nodes.reduce((tmp: Record<string, string[]>, node: ReturnType<LGraphNode["serialize"]>) => {
    tmp[node.id] = lite2inputs[node.type ?? '']
    return tmp;
  }, {});

  const outTypes = liteGraph.nodes.reduce((tmp: Record<string, string[]>, node: ReturnType<LGraphNode["serialize"]>) => {
    tmp[node.id] = lite2output[node.type ?? '']
    return tmp;
  }, {});
  
  // [link index, out node, out position, in node, in position]
  
  const linkObj = liteGraph.links.reduce((tmp: Record<string, string[] | any>, link: [number, number, number, number, number, string]) => {
    const [,outNodeId, outPositionIndex, inNodeId, inPositionIndex] = link;

    const pos = outTypes[outNodeId] && outTypes[outNodeId].length > 0 ? '.' + outTypes[outNodeId][outPositionIndex] : ''

    const inputNode = `:node_${outNodeId}${pos}`
    if (inputTypes[inNodeId] && inputTypes[inNodeId].length > 0) {
      if (tmp[inNodeId] === undefined) {
        tmp[inNodeId] = {};
      }
      const key = inputTypes[inNodeId][inPositionIndex];
      tmp[inNodeId][key] = inputNode;
    } else {
      if (tmp[inNodeId] === undefined) {
        tmp[inNodeId] = [];
      }
      tmp[inNodeId].push(inputNode);
    }
    return tmp;
  }, {});
  
  const nodes = liteGraph.nodes.reduce((tmp: Record<string, ComputedNodeData>, node: ReturnType<LGraphNode["serialize"]>) => {
    // [link index, out node, out position, in node, in position]
    const inputs = linkObj[node.id];
    const agent = lite2agent[node.type||''];
    tmp[`node_${node.id}`] = {
      agent: agent ? agent.name : node.type || '',
      inputs: inputs ? inputs : undefined,
    }
    return tmp;
  }, {});

  return {
    version: 0.5,
    nodes,
  };
};

export { liteGraph2GraphData };
