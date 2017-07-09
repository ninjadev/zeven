(function(global) {
  class texty extends NIN.Node {
    constructor(id, options) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.canvasTexture = new THREE.Texture(this.canvas);
      this.resize();
    }

    update(frame) {
    }

    render(renderer) {
      this.ctx.fillStyle = '#4444ff';
      this.ctx.save();
      this.ctx.scale(GU, GU);
      this.ctx.fillRect(0, 0, 16, 9);
      this.ctx.scale(1 / 4, 1 / 4);

      this.ctx.fillStyle = '#aaf';
      for(let x = 0; x < 16 * 4; x++) {
        this.ctx.fillRect(x, 0, 0.02, 9 * 4);
      }
      for(let y = 0; y < 9 * 4; y++) {
        this.ctx.fillRect(0, y, 16 * 4, 0.02);
      }

      this.ctx.translate(5, 5);

      this.fillStyle = 'white';
      this.strokeStyle = 'black';

      const step = 5 / 11;

      /* 7 */
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
      //this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.fillStyle = 'black';
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
      this.ctx.restore();
      this.ctx.fill();

      this.ctx.restore();


      this.outputs.render.setValue(this.canvasTexture);
      this.canvasTexture.needsUpdate = true;
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }
  }

  global.texty = texty;
})(this);
