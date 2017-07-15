(function(global) {
  class gradingNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        tDiffuse: new NIN.TextureInput(),
      };
      super(id, options);

      this.lookup = Loader.loadTexture('res/blueorange-grading.png');
      this.lookup.minFilter = THREE.LinearFilter;
      this.lookup.magFilter = THREE.LinearFilter;
      this.gammaCorrection = true;
      this.noiseAmount = 0.08;
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.tDiffuse.value = this.inputs.tDiffuse.getValue();
      this.uniforms.lookup.value = this.lookup;
      this.uniforms.gammaCorrection.value = +this.gammaCorrection;
      this.uniforms.noiseAmount.value = this.noiseAmount;
    }
  }

  global.gradingNode = gradingNode;
})(this);
