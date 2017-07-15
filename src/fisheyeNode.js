(function(global) {
  class fisheyeNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        tDiffuse: new NIN.TextureInput()
      };
      super(id, options);
    }

    update(frame) {
      this.uniforms.tDiffuse.value = this.inputs.tDiffuse.getValue();
      this.uniforms.frame.value = frame;
    }
  }

  global.fisheyeNode = fisheyeNode;
})(this);
