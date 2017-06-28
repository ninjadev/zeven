(function(global) {
  class SceneSwitcherNode extends NIN.Node {
    constructor(id) {
      super(id, {
        inputs: {
          A: new NIN.TextureInput(),
          B: new NIN.TextureInput(),
          C: new NIN.TextureInput(),
          D: new NIN.TextureInput(),
          E: new NIN.TextureInput(),
        },
        outputs: {
          render: new NIN.TextureOutput(),
        }
      });
    }

    update() {
      this.inputs.A.enabled = false;
      this.inputs.B.enabled = false;
      this.inputs.C.enabled = false;
      this.inputs.D.enabled = false;
      this.inputs.E.enabled = false;

      let selectedScene;
      if (BEAN < 432) {
        selectedScene = this.inputs.A;
      } else if (BEAN < 120 * 8) {
        selectedScene = this.inputs.B;
      } else if (BEAN < 130 * 8) {
        selectedScene = this.inputs.C;
      } else if (BEAN < 300 * 4) {
        selectedScene = this.inputs.D;
      } else {
        selectedScene = this.inputs.E;
      }

      selectedScene.enabled = true;
      this.outputs.render.setValue(selectedScene.getValue());
    }
  }

  global.SceneSwitcherNode = SceneSwitcherNode;
})(this);
