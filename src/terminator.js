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
      this.throb = 0;
    }

    update(frame) {
      this.throb *= 0.97;
      if(frame == 3428 || frame == 3429) {
        this.throb = 1;
      }
      if(BEAT && BEAN % 24 == 12) {
        this.throb = 0.3;
      }
      demo.nm.nodes.bloom.opacity = 0.1 + 3 * this.throb;
      demo.nm.nodes.grading.noiseAmount = 0.08;
      this.frame = frame;
      this.uniforms.frame.value = frame;
    }

    render(renderer) {
      this.ctx.save();

      this.ctx.scale(GU, GU);
      this.ctx.translate(8, 8);
      let zoom = lerp(1, 3, (this.frame - 4250) / (4525 - 4250));
      this.ctx.scale(zoom, zoom);
      this.ctx.translate(-8, -8);
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
      this.ctx.save();
      for(let i = 1488; BEAN >= i && i <= 1536; i += 8) {
        this.ctx.rotate(Math.PI * 2 / 7);
      }
      if(BEAN < 1536) {
        this.ctx.strokeRect(-size / 2, -size / 2, size, size);
      } else {
        if(BEAN >= 1536) {
        this.ctx.save();
        this.ctx.translate(-0.55, -0.5);
        this.ctx.scale(1 / 9, 1 / 9);
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(1,0);
        this.ctx.lineTo(3,6);
        this.ctx.lineTo(3,0);
        if(BEAN >= 1536 + 9) {
          this.ctx.lineTo(4,5);
        } else {
          this.ctx.lineTo(4,0);
        }
        this.ctx.lineTo(4,9);
        this.ctx.lineTo(3,9);
        this.ctx.lineTo(1,3);
        this.ctx.lineTo(1,9);
        this.ctx.lineTo(0,9);
        this.ctx.lineTo(0,0);
        this.ctx.fill();
        }

        if(BEAN >= 1536 + 9) {
        this.ctx.translate(-14.75, 0);
        this.ctx.beginPath();
        this.ctx.moveTo(17,0);
        this.ctx.lineTo(21,0);
        this.ctx.lineTo(21,6);
        this.ctx.lineTo(20,9);
        this.ctx.lineTo(17,0);
        this.ctx.moveTo(18.3333333333333333,1);
        this.ctx.lineTo(20,6);
        this.ctx.lineTo(20,1);
        this.ctx.lineTo(18.33333333333333333,1);
        this.ctx.fill();
        }

        if(BEAN > 1536 + 9 + 9) {
        this.ctx.translate(-3.5, 0);
        this.ctx.beginPath();
        this.ctx.moveTo(25,0);
        this.ctx.lineTo(26,0);
        this.ctx.lineTo(26,6);
        this.ctx.lineTo(28,0);
        this.ctx.lineTo(29,0);
        this.ctx.lineTo(26,9);
        this.ctx.lineTo(25,6);
        this.ctx.lineTo(25,0);
        this.ctx.fill();
        }

        this.ctx.restore();
      }
      if(BEAN >= 1488) {
        if(BEAN < 1536) {
          this.ctx.fillRect(-size / 2, -size / 2, size, size);
        }
      }


      this.ctx.restore();

      this.ctx.save();
      if(BEAN >= 1440) {
        this.ctx.rotate(Math.PI * 2 / 7);
      }
      if(BEAN >= 1440 + 9) {
        this.ctx.rotate(Math.PI * 2 / 7);
      }
      if(BEAN >= 1440 + 9 + 9 && BEAN < 1476) {
        this.ctx.rotate((this.frame - 4165) / 10);
      }
      if(BEAN >= 1476) {
        this.ctx.rotate(Math.PI * 2 * 5 / 7);
      }
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

      if(BEAN >= 1488) {
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        if(BEAN >= 1488) {
          this.ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        }
          this.ctx.beginPath();
          this.ctx.moveTo(-8, -8);
          this.ctx.lineTo(-8, 8);
          this.ctx.lineTo(8, 8);
          this.ctx.lineTo(8, -8);
          this.ctx.lineTo(-8, -8);
          this.ctx.fillStyle = 'white';
          this.ctx.moveTo(-1, -0.25);
          for(let i = 0; i < 4; i++) {
            this.ctx.lineTo(-1, -.5);
            this.ctx.lineTo(-.5, -1);
            this.ctx.lineTo(-0.25, -1);
            this.ctx.rotate(Math.PI / 2);
          }
          this.ctx.fill();
        this.ctx.restore();
      }

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
