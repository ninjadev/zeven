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

      if(this.inputs.sunpos.getValue()){
        var sunpos = this.inputs.sunpos.getValue();
        this.uniforms.sunX.value = sunpos.x;
        this.uniforms.sunY.value = sunpos.y;
      }else{
        this.uniforms.sunX.value = 0.0;
        this.uniforms.sunY.value = 0.0;
        this.uniforms.amount.value = .0;
      }
    }
  }

  global.LensFlareNode = LensFlareNode;
})(this);
