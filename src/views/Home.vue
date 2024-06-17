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

import { LiteGraph, initLiteGraph } from "./nodes";

export default defineComponent({
  name: "HomePage",
  components: {},
  setup() {
    const canvasRef = ref();

    onMounted(() => {
      initLiteGraph();

      const graph = new LGraph();
      new LGraphCanvas(canvasRef.value, graph);

      const node_const = LiteGraph.createNode("basic/BasicSum");
      node_const.pos = [200, 100];
      graph.add(node_const);

      const node_watch = LiteGraph.createNode("basic/BasicSum");
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
      pop_node.pos = [200, 400];

      const shift_node = LiteGraph.createNode("array/shift");
      graph.add(shift_node);
      shift_node.pos = [400, 400];
      shift_node.connect(0, pop_node, 0);
      
      const push_node = LiteGraph.createNode("array/push");
      graph.add(push_node);
      push_node.pos = [600, 400];
      push_node.connect(0, shift_node, 0);
      
      // ing_node.connect(0, openai_node, 3);

      
      graph.start();
    });
    return {
      canvasRef,
    };
  },
});
</script>
