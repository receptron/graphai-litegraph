<template>
  <div class="home">
    <div class="flex items-center justify-center space-x-8">
      <!-- Use Tailwind CSS h-40 (=10rem=160px) instead of .logo. -->
      <canvas id="mycanvas" width="1024" height="720" style="border: 1px solid" ref="canvasRef"></canvas>
    </div>
    <button @click="save" class="border-2 border-blue-200">Save</button>
    <button @click="load" class="border-2 border-blue-200">Load</button>
    <button @click="reset" class="border-2 border-blue-200">Reset</button>
    <button @click="download" class="border-2 border-blue-200">Download</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";

import { LGraph, LGraphCanvas } from "litegraph.js";
import "litegraph.js/css/litegraph.css";

import { liteGraph2GraphData } from "../utils/toGraphAi";
import { LiteGraph, setAgentToLiteGraph } from "../utils/setAgentToLiteGraph";

// import * as vanillaAgents from "@graphai/vanilla";
import { agentlist } from "../utils/agentlist";
import { defaultData } from "../utils/defaultData";

export default defineComponent({
  name: "HomePage",
  components: {},
  setup() {
    const canvasRef = ref();

    let lite2graph = {};

    let graph: LGraph | undefined = undefined;

    onMounted(() => {
      const agents = agentlist.agents.reduce((tmp: any, agent) => {
        tmp[agent.agentId] = agent;
        return tmp;
      }, {});
      lite2graph = setAgentToLiteGraph(agents);
      graph = new LiteGraph.LGraph();

      if (!load()) {
        graph.configure(defaultData);
      }
      new LGraphCanvas(canvasRef.value, graph);

      graph.start();
    });

    const download = () => {
      if (graph) {
        const data = graph.serialize();
        console.log(JSON.stringify(data));
        const graphData = liteGraph2GraphData(data, lite2graph as any);
        console.log(graphData);
        console.log(JSON.stringify(graphData, undefined, 2));
      }
    };
    const localStorageKey = "graphai-litegraph-data";

    const save = () => {
      if (graph) {
        const data = graph.serialize();
        localStorage.setItem(localStorageKey, JSON.stringify(data));
      }
    };
    const load = () => {
      const graphString = localStorage.getItem(localStorageKey);
      if (graphString && graph) {
        const data = JSON.parse(graphString);
        graph.configure(data);
      }
      return !!graphString;
    };
    const reset = () => {
      if (graph) {
        graph.configure(defaultData);
      }
    };
    return {
      download,
      canvasRef,
      save,
      load,
      reset,
    };
  },
});
</script>
