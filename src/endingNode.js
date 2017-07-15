(function(global) {
  class endingNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        tDiffuse: new NIN.TextureInput()
      };
      super(id, options);
    }

    update(frame) {
      const startFrame = FRAME_FOR_BEAN(81 * 12 * 4);
      this.uniforms.timer.value = smoothstep(0.0, 2.0, (frame - startFrame) / 50);
      this.uniforms.tDiffuse.value = this.inputs.tDiffuse.getValue();
    }
  }

  global.endingNode = endingNode;
})(this);
