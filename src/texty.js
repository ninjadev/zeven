(function(global) {
  class texty extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, {
        inputs: {
          imageA: new NIN.TextureInput(),
          imageB: new NIN.TextureInput(),
        },
        outputs: {
          render: new NIN.TextureOutput()
        },
        shader: 'Add',
      });

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.canvasTexture = new THREE.Texture(this.canvas);
      this.canvasTexture.minFilter = THREE.LinearFilter;
      this.canvasTexture.magFilter = THREE.LinearFilter;
      this.resize();

      const step = 5 / 11;
      this.linePoints = [
        /* horizontal */
        0, 0,
        37.5, 0,

        0, 2,
        37.5, 2,

        0, 3,
        37.5, 3,

        0, 5,
        37.5, 5,

        0, 7,
        37.5, 7,

        0, 9,
        37.5, 9,

        0, 11,
        37.5, 11,

        0, 13,
        37.5, 13,

        /* forward diagonal */
        6 + step * 2, 0,
        6 - step * 11, 13,

        8 + step * 3, 0,
        8 - step * 10, 13,

        9 + step * 3, 0,
        9 - step * 10, 13,

        11 + step * 3, 0,
        11 - step * 10, 13,

        16.5 + step * 3, 0,
        16.5 - step * 10, 13,

        19 + step * 3, 0,
        19 - step * 10, 13,

        21 + step * 3, 0,
        21 - step * 10, 13,

        23.5 + step * 3, 0,
        23.5 - step * 10, 13,

        29 + step * 3, 0,
        29 - step * 10, 13,

        31.5 + step * 3, 0,
        31.5 - step * 10, 13,

        35 + step * 3, 0,
        35 - step * 10, 13,

        37.5 + step * 3, 0,
        37.5 - step * 10, 13,

        /* vertical */
        0, 0,
        0, 13,

        2, 0,
        2, 13,

        6, 0,
        6, 13,

        8.2, 0,
        8.2, 13,
      ];
    }

    update(frame) {
      this.frame = frame;
      this.uniforms.opacity.value = 1;
      this.uniforms.A.value = BEAN < 816 ? this.inputs.imageA.getValue() : this.inputs.imageB.getValue();
      this.uniforms.B.value = this.canvasTexture;
    }

    render(renderer) {
      this.ctx.save();
      this.ctx.scale(GU, GU);
      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(0, 0, 16, 9);
      this.ctx.scale(1 / 4, 1 / 4);

      /*
      for(let x = 0; x < 16 * 4; x++) {
        this.ctx.fillRect(x, 0, 0.02, 9 * 4);
      }
      for(let y = 0; y < 9 * 4; y++) {
        this.ctx.fillRect(0, y, 16 * 4, 0.02);
      }
      */

      this.ctx.translate(13.5, 10);

      this.ctx.fillStyle = 'white';
      this.ctx.trokeStyle = 'black';
      this.ctx.globalAlpha = BEAN >= 804 ? 1 : 0;
      this.ctx.globalAlpha *= easeOut(1, 0, (this.frame - 2570) / 15);

      const step = 5 / 11;

      /* 7 */
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(8 + Math.sin(step * Math.PI * 2), 0);
      this.ctx.lineTo(8 + Math.sin(step * Math.PI * 2), 2);
      this.ctx.lineTo(8 + Math.sin(step * Math.PI * 2) - step * 11, 13);
      this.ctx.lineTo(6 - step * 11, 13);
      this.ctx.lineTo(6, 2);
      this.ctx.lineTo(2, 2);
      this.ctx.lineTo(2, 3);
      this.ctx.lineTo(0, 3);
      this.ctx.lineTo(0, 0);

      this.ctx.moveTo(9, 3);
      this.ctx.lineTo(31, 3);
      this.ctx.lineTo(31 + step * 4 + 2 - step * 6, 9);
      this.ctx.lineTo(31 + step * 4 + 2, 3);
      this.ctx.lineTo(31 + step * 4 + 4.5, 3);
      this.ctx.lineTo(31 - step * 6 + 4.5, 13);
      this.ctx.lineTo(31 - step * 6 + 2.5, 13);
      this.ctx.lineTo(31 - step * 3, 7);
      this.ctx.lineTo(31.5 - step * 10, 13);
      this.ctx.lineTo(9 - step * 10, 13);
      this.ctx.lineTo(9, 3);

      this.ctx.save();
      this.ctx.translate(11 - step * 2, 5);
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(0 - step * 2, 2);
      this.ctx.lineTo(5.5 - step * 2, 2);
      this.ctx.lineTo(5.5, 0);
      this.ctx.lineTo(0, 0);
      this.ctx.restore();

      this.ctx.save();
      this.ctx.translate(11 - step * 6, 9);
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(0 - step * 2, 2);
      this.ctx.lineTo(5.5 - step * 2, 2);
      this.ctx.lineTo(5.5, 0);
      this.ctx.lineTo(0, 0);
      this.ctx.restore();

      this.ctx.save();
      this.ctx.translate(23.5 - step * 2, 5);
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(0 - step * 2, 2);
      this.ctx.lineTo(5.5 - step * 2, 2);
      this.ctx.lineTo(5.5, 0);
      this.ctx.lineTo(0, 0);
      this.ctx.restore();

      this.ctx.save();
      this.ctx.translate(23.5 - step * 6, 9);
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(0 - step * 2, 2);
      this.ctx.lineTo(5.5 - step * 2, 2);
      this.ctx.lineTo(5.5, 0);
      this.ctx.lineTo(0, 0);
      this.ctx.restore();

      this.ctx.save();
      this.ctx.translate(19 - step * 2, 5);
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(0 - step * 6, 6);
      this.ctx.lineTo(2 - step * 2, 2);
      this.ctx.lineTo(2, 0);
      this.ctx.lineTo(0, 0);
      this.ctx.restore();

      this.ctx.fill();
      this.ctx.lineWidth = 0.2;
      this.ctx.lineCap = 'square';
      this.ctx.strokeStyle = 'white';
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.strokeStyle = 'black';
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      this.ctx.save();
      this.ctx.translate(16, 3);
      this.ctx.moveTo(0.5, 0);
      this.ctx.lineTo(7.5, 0);
      this.ctx.lineTo(7.5 - step * 4.2, 4.2);
      this.ctx.lineTo(0, 10);
      this.ctx.lineTo(-2.5, 10);
      this.ctx.lineTo(5 - step * 4, 4);
      this.ctx.lineTo(5 - step * 2, 2);
      this.ctx.lineTo(3 - step * 2, 2);
      this.ctx.lineTo(3 - step * 3.0, 3.0);
      this.ctx.lineTo(0.5 - step * 3.0, 3.0);
      this.ctx.lineTo(0.5, 0);
      this.ctx.restore();
      this.ctx.stroke();
      this.ctx.fill();

      this.ctx.strokeStyle = 'white';
      this.ctx.fillStyle = 'white';
      this.ctx.lineWidth = 0.1;
      for(let i = 0; i < this.linePoints.length; i+= 8) {
        this.ctx.globalAlpha = easeOut(.5, 0, (this.frame - 2295) / 60);
        this.ctx.beginPath();
        const dx0 = this.linePoints[i] - this.linePoints[i + 2];
        const dy0 = this.linePoints[i + 1] - this.linePoints[i + 3];
        const dx1 = this.linePoints[i + 4] - this.linePoints[i + 4 + 2];
        const dy1 = this.linePoints[i + 4 + 1] - this.linePoints[i + 4 + 3];
        let incline0 = dx0 / dy0;
        let incline1 = dx1 / dy1;
        const distance = 60;
        let animation = smoothstep(0, 1, (this.frame - 2193 - i * 0.95 + 40) / 90);
        if(dy0 == 0) {
          this.ctx.moveTo(this.linePoints[i] - distance, this.linePoints[i + 1]);
          this.ctx.lineTo(this.linePoints[i] - distance + 2 * distance * animation, this.linePoints[i + 1]);
          this.ctx.lineTo(this.linePoints[i+4] - distance + 2 * distance * animation, this.linePoints[i+4+ 1]);
          this.ctx.lineTo(this.linePoints[i+4] - distance, this.linePoints[i+4 + 1]);
          this.ctx.lineTo(this.linePoints[i] - distance, this.linePoints[i + 1]);
        } else {
          this.ctx.moveTo(this.linePoints[i] - distance * incline0, this.linePoints[i + 1] - distance);
          this.ctx.lineTo(this.linePoints[i] - distance * incline0 + 2 * distance * incline0 * animation, this.linePoints[i + 1] -distance + 2 * distance * animation);
          this.ctx.lineTo(this.linePoints[i+4] - distance * incline1 + 2 * distance * incline1 * animation, this.linePoints[i+4 + 1] -distance + 2 * distance * animation);
          this.ctx.lineTo(this.linePoints[i+4] - distance * incline0, this.linePoints[i+4 + 1] - distance);
          this.ctx.lineTo(this.linePoints[i] - distance * incline0, this.linePoints[i + 1] - distance);
        }
        this.ctx.stroke();
        this.ctx.globalAlpha *= 0.5;
        this.ctx.fill();
      }


      this.ctx.restore();

      this.canvasTexture.needsUpdate = true;
      super.render(renderer);
    }

    resize() {
      if(this.canvas) {
        this.canvas.width = 16 * GU;
        this.canvas.height = 9 * GU;
      }
      super.resize();
    }
  }

  global.texty = texty;

})(this);
