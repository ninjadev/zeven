(function(global) {
  class DragonBallNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);
    }

    update(frame) {

      let iGlobalTime = Math.max(0., frame - FRAME_FOR_BEAN(48 + 37*48));
      iGlobalTime /= 60.;

      this.uniforms.iGlobalTime.value = iGlobalTime;
      demo.nm.nodes.bloom.opacity = 0.;
      demo.nm.nodes.grading.amount = 0.;
      demo.nm.nodes.grading.gammaCorrection = 0.;

    }
  }

  global.DragonBallNode = DragonBallNode;
})(this);
