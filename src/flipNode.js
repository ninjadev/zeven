(function(global) {
  class flipNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
      image: new NIN.TextureInput(),
      };
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.tDiffuse.value = this.inputs.image.getValue();
    }
  }

  global.flipNode = flipNode;
})(this);
