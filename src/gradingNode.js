(function(global) {
  class gradingNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        tDiffuse: new NIN.TextureInput(),
      }
      super(id, options);

      this.lookup = Loader.loadTexture('res/blueorange-grading.png');
      this.lookup.minFilter = THREE.LinearFilter;
      this.lookup.magFilter = THREE.LinearFilter;
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.tDiffuse.value = this.inputs.tDiffuse.getValue();
      this.uniforms.lookup.value = this.lookup;
    }
  }

  global.gradingNode = gradingNode;
})(this);
