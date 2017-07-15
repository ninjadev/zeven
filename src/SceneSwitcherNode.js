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
          G: new NIN.TextureInput(),
          H: new NIN.TextureInput(),
          I: new NIN.TextureInput(),
          J: new NIN.TextureInput(),
          K: new NIN.TextureInput(),
          L: new NIN.TextureInput(),
          M: new NIN.TextureInput(),
          N: new NIN.TextureInput(),
          O: new NIN.TextureInput(),
          P: new NIN.TextureInput(),
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
      this.inputs.G.enabled = false;
      this.inputs.H.enabled = false;
      this.inputs.I.enabled = false;
      this.inputs.J.enabled = false;
      this.inputs.K.enabled = false;
      this.inputs.L.enabled = false;
      this.inputs.M.enabled = false;
      this.inputs.N.enabled = false;
      this.inputs.O.enabled = false;
      this.inputs.P.enabled = false;

      let selectedScene;
      if (BEAN < song(8)) {
        selectedScene = this.inputs.A;
      } else if (BEAN < song(15)) {
        selectedScene = this.inputs.B;
      } else if (BEAN < song(18)) {
        selectedScene = this.inputs.C;
      } else if (BEAN < song(20)) {
        selectedScene = this.inputs.D;
      } else if (BEAN < song(24)) {
        selectedScene = this.inputs.E;
      } else if (BEAN < song(32)) {
        selectedScene = this.inputs.F;
      } else if (BEAN < song(34, 1)) {
        selectedScene = this.inputs.G;
      } else if (BEAN < song(34, 2.7)) {
        selectedScene = this.inputs.H;
      } else if (BEAN < song(36)) {
        selectedScene = this.inputs.G;
      } else if (BEAN < song(37)) {
        selectedScene = this.inputs.N;
      } else if (BEAN < song(39)) {
        selectedScene = this.inputs.O;
      } else if (BEAN < song(40)) {
        selectedScene = this.inputs.P;
      } else if (BEAN < song(48)) {
        selectedScene = this.inputs.I;
      } else if (BEAN < song(56)) {
        selectedScene = this.inputs.J;
      } else if (BEAN < song(56 + 8)) {
        selectedScene = this.inputs.K;
      } else if (BEAN < song(66 + 8)) {
        selectedScene = this.inputs.L;
      } else {
        selectedScene = this.inputs.M;
      }

      selectedScene.enabled = true;
      this.outputs.render.setValue(selectedScene.getValue());
    }
  }

  global.SceneSwitcherNode = SceneSwitcherNode;
})(this);
