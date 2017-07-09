(function(global) {
  class filmfxNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        image: new NIN.TextureInput(),
      };
      super(id, options);
      this.uniforms.translation.value = new THREE.Vector2(0, 0);
      this.random = new Random('filmfx');
      this.yoffset = 0;
    }

    update(frame) {
      if(frame == 0) {
        this.random = new Random('filmfx');
      }
      this.uniforms.frame.value = frame;
      this.uniforms.tDiffuse.value = this.inputs.image.getValue();
      const x = Math.sin(frame / 43) * 0.002 +
        Math.cos(frame / 67) * 0.003 +
        Math.sin(frame / 79) * 0.005 +
        Math.cos(frame / 2.0247) * 0.0008 +
        easeOut(-1, 0, (frame - 30) / 10);
      let y = (frame / 4 | 0) * easeOut(0, 1, (frame - 35) / 120) + 0.3 * Math.cos(frame / 87) * Math.sin(frame * 123293874) * Math.tan(frame / 10 * Math.sin(frame / 1000) * Math.cos(frame / 100)) * 0.01;
      y += 0.0005 * Math.tan(frame / 100) * Math.sin(frame / 200);
      const expression = Math.sin(frame / 100) * Math.cos(frame / 132);
      y += 0.25 * Math.pow(expression, 16) * Math.sign(expression);
      if(frame % 4 == 0) {
        this.yoffset = 0.02 * this.random();
      }
      y += this.yoffset;
      this.uniforms.translation.value.set(x, y);
    }
  }

  global.filmfxNode = filmfxNode;
})(this);
