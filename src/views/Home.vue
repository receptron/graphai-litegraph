<template>
  <div class="home">
    <div class="flex items-center justify-center space-x-8">
      <!-- Use Tailwind CSS h-40 (=10rem=160px) instead of .logo. -->
      <canvas id="mycanvas" width="1024" height="720" style="border: 1px solid" ref="canvasRef"></canvas>
    </div>
    <Button @click="download" class="border-2 border-blue-200">Download</Button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";

import { LGraph, LGraphCanvas } from "litegraph.js";
import "litegraph.js/css/litegraph.css";

import { LiteGraph, initLiteGraph, liteGraph2GraphData } from "./nodes";

export default defineComponent({
  name: "HomePage",
  components: {},
  setup() {
    const canvasRef = ref();
    let lite2agent = {};
    const graph = new LGraph();

    onMounted(() => {
      const ret = initLiteGraph();
      lite2agent = ret.lite2agent;

      new LGraphCanvas(canvasRef.value, graph);

      const node_const = LiteGraph.createNode("data/copy");
      node_const.pos = [200, 100];
      graph.add(node_const);

      const node_watch = LiteGraph.createNode("data/total");
      node_watch.pos = [700, 100];
      graph.add(node_watch);
      node_const.connect(0, node_watch, 0);

      const openai_node = LiteGraph.createNode("llm/OpenAI");
      graph.add(openai_node);
      openai_node.pos = [700, 200];

      const string_node = LiteGraph.createNode("string/stringTemplate");
      graph.add(string_node);
      string_node.pos = [200, 200];
      string_node.connect(0, openai_node, 3);

      const string_node2 = LiteGraph.createNode("string/stringTemplate");
      graph.add(string_node2);
      string_node2.pos = [200, 300];
      string_node2.connect(0, openai_node, 0);

      const pop_node = LiteGraph.createNode("array/pop");
      graph.add(pop_node);
      pop_node.pos = [400, 400];

      const shift_node = LiteGraph.createNode("array/shift");
      graph.add(shift_node);
      shift_node.pos = [200, 400];
      shift_node.connect(1, pop_node, 0);

      const push_node = LiteGraph.createNode("array/push");
      graph.add(push_node);
      push_node.pos = [600, 400];
      pop_node.connect(1, push_node, 0);

      // ing_node.connect(0, openai_node, 3);

      graph.start();
    });

    const download = () => {
      const data = graph.serialize();
      console.log(data);
      // const json = JSON.stringify(graph.serialize(), null, 2);
      liteGraph2GraphData(data, lite2agent);
    };

    return {
      download,
      canvasRef,
    };
  },
});
</script>
