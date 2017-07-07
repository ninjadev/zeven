(function(global) {

  function song(bars, beats) {
    bars = bars || 0;
    beats = beats || 0;
    return 48 + bars * 48 + 12 * beats;
  }

  global.song = song;

  class SceneSwitcherNode extends NIN.Node {
    constructor(id) {
      super(id, {
        inputs: {
          A: new NIN.TextureInput(),
          B: new NIN.TextureInput(),
          C: new NIN.TextureInput(),
          D: new NIN.TextureInput(),
          E: new NIN.TextureInput(),
          F: new NIN.TextureInput(),
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
      this.inputs.F.enabled = false;

      let selectedScene;
      if (BEAN < song(8)) {
        selectedScene = this.inputs.A;
      } else if (BEAN < song(16)) {
        selectedScene = this.inputs.B;
      } else if (BEAN < song(24)) {
        selectedScene = this.inputs.C;
      } else if (BEAN < song(32)) {
        selectedScene = this.inputs.D;
      } else if (BEAN < song(40)) {
        selectedScene = this.inputs.E;
      } else {
        selectedScene = this.inputs.F;
      }

      selectedScene.enabled = true;
      this.outputs.render.setValue(selectedScene.getValue());
    }
  }

  global.SceneSwitcherNode = SceneSwitcherNode;
})(this);
