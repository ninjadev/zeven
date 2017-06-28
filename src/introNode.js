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

      const bean = BEAN_FOR_FRAME(frame);
      //const index = bean / 48 | 0;
      let toDraw;
      if (bean < 48 * 1) {
        toDraw = '';
      } else if (bean < 48 * 2) {
        toDraw = '10';
      } else if (bean < 48 * 3) {
        toDraw = '9';
      } else if (bean < 48 * 4) {
        toDraw = '8';
      } else if (bean < 48 * 5) {
        toDraw = '7';
      } else if (bean < 48 * 6) {
        toDraw = '6';
      } else if (bean < 48 * 6.5) {
        toDraw = '7';
      } else if (bean < 48 * 7) {
        toDraw = '6';
      } else if (bean < 48 * 7.5) {
        toDraw = '7';
      } else if (bean < 48 * 8) {
        toDraw = '6';
      } else if (bean < 48 * 8.5) {
        toDraw = '8';
      } else {
        toDraw = '7';
      }

      this.ctx.fillStyle = '#837B6B';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw grid
      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(0, this.canvas.height / 2, this.canvas.width, 1.5);
      this.ctx.fillRect(this.canvas.width / 2, 0, 1.5, this.canvas.height);

      // Circle outlines
      this.ctx.strokeStyle = '#CFCDC5';
      this.ctx.beginPath();
      this.ctx.lineWidth = 1.5;
      this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, 167, 0, 2 * Math.PI, false);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, 150, 0, 2 * Math.PI, false);
      this.ctx.stroke();

      // Gray fill
      const base = - Math.PI / 2;
      let radians;
      if (bean < 48 * 6) {
        radians = 2 * Math.PI * ((bean / 48) % 1);
      } else {
        radians = 2 * Math.PI * ((bean * 2 / 48) % 1);
      }

      this.ctx.beginPath();
      this.ctx.moveTo(this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, 500, base, base + radians, false);
      this.ctx.lineTo(this.canvas.width / 2, this.canvas.height / 2);

      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      this.ctx.fill();

      this.ctx.lineWidth = 3.0;
      this.ctx.strokeStyle = 'black';
      this.ctx.stroke();

      // Draw number
      this.ctx.fillStyle = 'black';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.font = '250px Arial';
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
