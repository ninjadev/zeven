(function(global) {
  class LensFlareNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        image: new NIN.TextureInput(),
        sunpos: new NIN.Input(),
      };

      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.tDiffuse.value = this.inputs.image.getValue();

      this.uniforms.sunX.value = Math.sin(frame/40)/2 + .5;
      this.uniforms.sunY.value = Math.cos(frame/40)/2 + .5;
      this.uniforms.amount.value = Math.sin(frame/80)/3 + .5;;
    }
  }

  global.LensFlareNode = LensFlareNode;
})(this);
