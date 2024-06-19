import { ComputedNodeData } from "graphai";

const liteGraph2GraphData = (liteGraph: any, lite2agent: any, lite2inputs: any, lite2output: any) => {
  const inputTypes = liteGraph.nodes.reduce((tmp: Record<string, string[]>, node: any) => {
    tmp[node.id] = lite2inputs[node.type]
    return tmp;
  }, {});
  const outTypes = liteGraph.nodes.reduce((tmp: Record<string, string[]>, node: any) => {
    tmp[node.id] = lite2output[node.type]
    return tmp;
  }, {});
  
  // [link index, out node, out position, in node, in position]
  const linkObj = liteGraph.links.reduce((tmp: Record<string, string[] | any>, link: string[]) => {
    const pos = outTypes[link[1]] && outTypes[link[1]].length > 0 ? '.' + outTypes[link[1]][link[2]] : ''
    const inputNode = `:node_${link[1]}${pos}`
    if (inputTypes[link[3]] && inputTypes[link[3]].length > 0) {
      if (tmp[link[3]] === undefined) {
        tmp[link[3]] = {};
      }
      const key = inputTypes[link[3]][link[4]];
      tmp[link[3]][key] = inputNode;
    } else {
      if (tmp[link[3]] === undefined) {
        tmp[link[3]] = [];
      }
      tmp[link[3]].push(inputNode);
    }
    return tmp;
  }, {});
  
  const nodes = liteGraph.nodes.reduce((tmp: Record<string, ComputedNodeData>, node: any) => {
    // [link index, out node, out position, in node, in position]
    const inputs = linkObj[node.id];
    const agent = lite2agent[node.type];
    tmp[`node_${node.id}`] = {
      agent: agent ? agent.name : node.type,
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
