(function(global) {
  class cartoontwisterNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
    }
  }

  global.cartoontwisterNode = cartoontwisterNode;
})(this);
