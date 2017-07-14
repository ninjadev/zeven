(function(global) {
  class KaleidroScopeNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {image: new NIN.TextureInput()};
      super(id, options);
      this.frame = 6719;
      this.throb = 0;
      this.weakThrob = 0;
    }

    update(frame) {
      this.uniforms.frame.value = frame - 1096;
      this.uniforms.tDiffuse.value = this.inputs.image.getValue();
      this.frame = frame - 1096;
      this.throb *= 0.9;
      this.weakThrob *= 0.95;
      const beanOffset = 48 * 8;
      if(this.frame == 7782) {
        this.throb = 1;
      }
      if(BEAT && BEAN == beanOffset + 2388 + 3) {
        this.weakThrob = 1;
      }
      if(BEAT && BEAN == beanOffset + 2388 + 12) {
        this.weakThrob = 1;
      }
      if(BEAT && BEAN == beanOffset + 2448) {
        this.weakThrob = 0.3;
      }
      if(BEAT && BEAN == beanOffset + 2448 + 18) {
        this.weakThrob = 0.3;
      }
      if(BEAT && BEAN == beanOffset + 2448 + 36) {
        this.weakThrob = 0.3;
      }
      if(BEAT && BEAN == beanOffset + 2544) {
        this.weakThrob = .5;
      }
      if(BEAT && BEAN == beanOffset + 2580 + 3) {
        this.weakThrob = .3;
      }
      if(BEAT && BEAN == beanOffset + 2580 + 12) {
        this.weakThrob = .3;
      }
    }

    render(renderer) {
      demo.nm.nodes.grading.gammaCorrection = true;
      demo.nm.nodes.bloom.opacity = easeOut(100, 1.5, (this.frame - 6719) / 60);
      if(this.frame > 6719 + 60) {
        demo.nm.nodes.bloom.opacity = 1.5 + 10 * this.weakThrob;
      }
      if(this.frame >= 7782) {
        demo.nm.nodes.bloom.opacity = 20 * this.throb;
      }
      super.render(renderer);
    }
  }

  global.KaleidroScopeNode = KaleidroScopeNode;
})(this);
