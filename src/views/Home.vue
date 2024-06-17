<template>
  <div class="home">
    <div class="flex items-center justify-center space-x-8">
      <!-- Use Tailwind CSS h-40 (=10rem=160px) instead of .logo. -->
      <canvas id="mycanvas" width="1024" height="720" style="border: 1px solid" ref="canvasRef"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";

import { LGraph, LGraphCanvas } from "litegraph.js";
import "litegraph.js/css/litegraph.css";

import { LiteGraph } from "./nodes";

export default defineComponent({
  name: "HomePage",
  components: {},
  setup() {
    const canvasRef = ref();

    // init menu

    onMounted(() => {
      const graph = new LGraph();
      new LGraphCanvas(canvasRef.value, graph);

      const node_const = LiteGraph.createNode("basic/sum");
      node_const.pos = [200, 200];
      graph.add(node_const);

      const node_watch = LiteGraph.createNode("basic/sum");
      node_watch.pos = [700, 200];
      graph.add(node_watch);

      const openai_node = LiteGraph.createNode("graphai/OpenAIAgent");
      graph.add(openai_node);
      openai_node.pos = [700, 400];

      const string_node = LiteGraph.createNode("basic/stringInput");
      graph.add(string_node);
      string_node.pos = [200, 600];
      string_node.connect(0, openai_node, 3);

      const string_node2 = LiteGraph.createNode("graphai/StringTemplateAgent");
      graph.add(string_node2);
      string_node2.pos = [200, 400];
      string_node2.connect(0, openai_node, 0);

      node_const.connect(0, node_watch, 0);

      graph.start();
    });
    return {
      canvasRef,
    };
  },
});
</script>
