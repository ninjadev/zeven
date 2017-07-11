(function(global) {
  class introNode extends NIN.THREENode {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.output = new THREE.VideoTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;
    }

    update(frame) {
      super.update(frame);
      this.canvas.width += 0;
      demo.nm.nodes.bloom.opacity = .5;

      this.frame = frame;

      const bean = BEAN_FOR_FRAME(frame);
      //const index = bean / 48 | 0;
      let toDraw;
      if (bean < 48 * 1 - 12) {
        toDraw = null;
      } else if (bean < 48 * 2 - 12) {
        toDraw = '10';
      } else if (bean < 48 * 3 - 12) {
        toDraw = '9';
      } else if (bean < 48 * 4 - 12) {
        toDraw = '8';
      } else if (bean < 48 * 5 - 12) {
        toDraw = '7';
      } else if (bean < 48 * 6 - 12) {
        toDraw = '6';
      } else if (bean < 48 * 7 - 12) {
        toDraw = '8';
      } else if (bean < 48 * 8 - 12) {
        toDraw = '7';
      } else if (bean < 48 * 8.25 - 12) {
        toDraw = '8';
      } else if (bean < 48 * 8.5 - 12) {
        toDraw = '7';
      } else if (bean < 48 * 8.75 - 12) {
        toDraw = '8';
      } else if (bean < 48 * 9 - 12) {
        toDraw = '6';
      } else {
        toDraw = '7';
      }

      this.ctx.save();
      this.ctx.scale(GU, GU);

      this.ctx.fillStyle = '#837B6B';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw grid
      this.ctx.fillStyle = '#111';
      this.ctx.fillRect(0, 4.5 - 0.025, 16, 0.05);
      this.ctx.fillRect(8 - 0.025, 0, 0.05, 9);

      // Circle outlines
      this.ctx.strokeStyle = '#CFCDC5';
      this.ctx.beginPath();
      this.ctx.lineWidth = 0.1;
      this.ctx.arc(8, 4.5, 4.2, 0, 2 * Math.PI, false);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.arc(8, 4.5, 3.7, 0, 2 * Math.PI, false);
      this.ctx.stroke();

      if (!toDraw) {
        return this.ctx.restore();
      }

      // Gray fill
      const base = - Math.PI / 2;
      let radians;
      const discrete = (frame / 4 | 0) * 4;
      if (bean < 48 * 8 - 12) {
        radians = ((2 * Math.PI * discrete / 60 / 60 * 105 / 4 + Math.PI / 2) % (Math.PI * 2));
      } else {
        radians = ((2 * Math.PI * discrete / 60 / 60 * 105 / 2 + Math.PI / 2) % (Math.PI * 2));
      }

      this.ctx.beginPath();
      this.ctx.moveTo(8, 4.5);
      this.ctx.arc(8, 4.5, 10, base, base + radians, false);
      this.ctx.lineTo(8, 4.5);

      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      this.ctx.fill();

      this.ctx.lineWidth = 0.1;
      this.ctx.strokeStyle = '#111';
      this.ctx.stroke();

      this.ctx.restore();

      // Draw number
      this.ctx.fillStyle = '#111';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.font = `${6 * GU}px Arial`;
      this.ctx.fillText(toDraw, this.canvas.width / 2, this.canvas.height / 2);
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }

    render() {
      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.introNode = introNode;
})(this);
