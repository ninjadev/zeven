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

      //this.uniforms.sunX.value = this.inputs.subpos.getValue()
      //this.uniforms.sunY.value

    /*var relativeFrame = frame - this.config.startFrame;
    var endRelativeFrame = this.config.endFrame - frame; 
    this.shaderPass.uniforms.width.value = 16 * 8;
    this.shaderPass.uniforms.height.value = 9 * 8;
    this.shaderPass.uniforms.time.value = frame;
    this.shaderPass.uniforms.amount.value = lerp(0, 1.0, Math.min(Math.min(relativeFrame,endRelativeFrame) / 70, 1));
    //this.shaderPass.uniforms.sunX.value = lerp(1.0,0.3, relativeFrame/(endRelativeFrame-relativeFrame));
    console.log(frame);
    if(frame<1820) {
      this.shaderPass.uniforms.sunX.value = 
          -0.2 - (1820- frame)/500;
          //0.9 - 1.5*Math.pow(endRelativeFrame/(this.config.endFrame-this.config.startFrame), 2.6);
      this.shaderPass.uniforms.sunY.value = 
          0.75 + (1820 - frame)/200;
    } else if (frame<1906) {
      this.shaderPass.uniforms.sunX.value = -0.2;
      this.shaderPass.uniforms.sunY.value = 0.75;
    } else {
      this.shaderPass.uniforms.sunX.value = -0.2  + Math.pow((frame - 1906),2.5)/Math.pow(180,2.5)*0.6;
      this.shaderPass.uniforms.sunY.value = 0.75 + Math.pow((frame - 1906),1.5)/Math.pow(180,1.5)*0.4;
    }*/
    }
  }

  global.LensFlareNode = LensFlareNode;
})(this);
