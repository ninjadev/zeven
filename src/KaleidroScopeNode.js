(function(global) {
  class KaleidroScopeNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {image: new NIN.TextureInput()};
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.tDiffuse.value = this.inputs.image.getValue();
    }
  }

  global.KaleidroScopeNode = KaleidroScopeNode;
})(this);
