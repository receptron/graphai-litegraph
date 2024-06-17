import { LGraphNode } from "litegraph.js";

export class BasicSumAgent extends LGraphNode {
  constructor() {
    super("Sum");
    this.addInput("A", "number");
    this.addInput("B", "number");
    this.addOutput("A+B", "number");
    this.properties = { precision: 1 };
  }

  onExecute() {
    let A = this.getInputData(0);
    if (A === undefined) A = 0;
    let B = this.getInputData(1);
    if (B === undefined) B = 0;
    this.setOutputData(0, A + B);
  }
}

export class StringInputNode extends LGraphNode {
  constructor() {
    super("String Input");
    this.addOutput("Output", "string");
    this.properties = { text: "" };
  }
  onDrawBackground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) {
      return;
    }
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, this.size[0], this.size[1]);
    ctx.fillStyle = "#FFF";
    ctx.font = "14px Arial";
    ctx.fillText(this.properties.text, 10, 30);
  }
}

export class TextInputAgentNode extends LGraphNode {
  constructor() {
    super("TextInput");
    this.properties = { message: "?:" };
    this.addOutput("", "string");
  }
}

export class OpenAIAgentNode extends LGraphNode {
  constructor() {
    super("OpenAI");
    this.addInput("prompt", "string");
    this.addInput("model", "string");
    this.addInput("system", "string");
    this.addInput("baseUrl", "string");

    this.addOutput(".choices.$0.message.content", "string");
    this.addOutput(".", "object");
  }
}

export class StringTemplateAgentNode extends LGraphNode {
  constructor() {
    super("StringTemplate");
    this.properties = { template: "${0}" };
    this.addInput("${0}", "string");
    this.addOutput("Output", "string");
  }

  onPropertyChanged(name: string, value: string) {
    this.properties[name] = value;
  }
}

export class PropertyFilterAgentNode extends LGraphNode {
  constructor() {
    super("PropertyFilter");
    this.addInput("In", "string");
    this.addOutput("", "string");
  }

  onExecute = function () {};
}
