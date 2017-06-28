(function(global) {
  class thresholdNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        image: new NIN.TextureInput(),
      };
      super(id, options);
      this.uniforms.threshold.value = options.thresholdValue;
      this.renderTarget = new THREE.WebGLRenderTarget(1024, 1024, {
        format: THREE.RGBAFormat
      });
    }

    resize() {
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.tDiffuse.value = this.inputs.image.getValue();
    }
  }

  global.thresholdNode = thresholdNode;
})(this);
