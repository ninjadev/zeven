(function(global) {
  class MyMarchNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);
      console.log("maaarch");
      this.throb = 0;
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.BEAN.value = BEAN;
      this.throb *= 0.95;
      if (BEAT && BEAN % 12 == 0) {
        this.throb = 1;
      }
      demo.nm.nodes.bloom.opacity = this.throb;
    }
  }

  global.MyMarchNode = MyMarchNode;
})(this);
