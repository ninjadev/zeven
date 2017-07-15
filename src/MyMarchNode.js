(function(global) {
  class MyMarchNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);
      this.throb = 0;
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.BEAN.value = BEAN;
      this.throb *= 0.9;
      if (BEAT && BEAN % 12 == 0) {
        this.throb = 5;
      }
      demo.nm.nodes.bloom.opacity = this.throb;
      if(BEAN >= 3696) {
        if(BEAT) {
          demo.nm.nodes.bloom.opacity = 5;
        } else {
          demo.nm.nodes.bloom.opacity = 1;
        }
      }
    }
  }

  global.MyMarchNode = MyMarchNode;
})(this);
