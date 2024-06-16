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

import { LGraph, LGraphCanvas, LiteGraph } from "litegraph.js";
import "litegraph.js/css/litegraph.css"

export default defineComponent({
  name: "HomePage",
  components: {},
  setup() {
    const canvasRef = ref();
    onMounted(() => {
      const graph = new LGraph();

      const canvas = new LGraphCanvas(canvasRef.value, graph);

      const node_const = LiteGraph.createNode("basic/const");
      node_const.pos = [200, 200];
      graph.add(node_const);
      node_const.setValue(4.5);

      const node_watch = LiteGraph.createNode("basic/watch");
      node_watch.pos = [700, 200];
      graph.add(node_watch);

      node_const.connect(0, node_watch, 0);
      graph.start();
    });
    return {
      canvasRef,
    };
  },
});
</script>
