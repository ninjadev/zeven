(function(global) {
  class terminator extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        image: new NIN.TextureInput(),
      };

      super(id, options);

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.texture = new THREE.Texture(this.canvas);
      this.texture.minFilter = THREE.LinearFilter;
      this.texture.magFilter = THREE.LinearFilter;
      this.resize();
    }

    update(frame) {
      demo.nm.nodes.bloom.opacity = 1.0;
      this.frame = frame;
      this.uniforms.frame.value = frame;
    }

    render(renderer) {
      this.ctx.save();

      this.ctx.scale(GU, GU);
      this.ctx.globalAlpha = 0.2;
      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(0, 0, 16, 16);
      this.ctx.globalAlpha = 1;
      this.ctx.fillStyle = 'white';
      this.ctx.strokeStyle = 'white';
      this.ctx.lineWidth = 0.03;
      const size = .8;
      this.ctx.save();
      this.ctx.translate(8, 8);
      this.ctx.strokeRect(-size / 2, -size / 2, size, size);

      this.ctx.save();
      for(let i = 0; i < 4; i++) {
        this.ctx.rotate(Math.PI / 2);
        this.ctx.beginPath();
        this.ctx.moveTo(-1, -0.25);
        this.ctx.lineTo(-1, -.5);
        this.ctx.lineTo(-.5, -1);
        this.ctx.lineTo(-0.25, -1);
        this.ctx.stroke();
      }
      this.ctx.restore();

      for(let i = 0; i < 4 + 2 * Math.sin(this.frame / 5); i++) {
        this.ctx.fillRect(-5, 3 - i * 0.2, 0.5, 0.1);
      }
      for(let i = 0; i < 4 + 2 * Math.cos(this.frame / 3); i++) {
        this.ctx.fillRect(-4.3, 3 - i * 0.2, 0.5, 0.1);
      }
      for(let i = 0; i < 2 + 2 * Math.sin(this.frame / 2); i++) {
        this.ctx.fillRect(-3.6, 3 - i * 0.2, 0.5, 0.1);
      }

      this.ctx.fillStyle = '#ff982a';
      this.ctx.font = '0.5pt Arial';
      this.ctx.fillText('REC ●', -5, -2.5);
      this.ctx.font = '0.42pt Arial';
      this.ctx.textAlign = 'right';
      this.ctx.fillText('' + this.frame, 5, -2.5);

      this.ctx.restore();

      this.ctx.restore();
      this.texture.needsUpdate = true;
      this.uniforms.tDiffuse.value = this.inputs.image.getValue();
      this.uniforms.overlay.value = this.texture;
      this.uniforms.amount.value = easeOut(0, 1, (this.frame - 4008 + 12) / 24);
      super.render(renderer);
    }

    resize() {
      super.resize();
      if(this.canvas) {
        this.canvas.width = 16 * GU;
        this.canvas.height = 16 * GU;
      }
    }
  }

  global.terminator = terminator;
})(this);
