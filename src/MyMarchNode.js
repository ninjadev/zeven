(function(global) {
  class MyMarchNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);
      console.log("maaarch");
    }

    update(frame) {
      this.uniforms.frame.value = frame;
    }
  }

  global.MyMarchNode = MyMarchNode;
})(this);
