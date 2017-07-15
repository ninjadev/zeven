(function(global) {
  class sevenDisplay extends NIN.THREENode {
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

      // This clears the canvas
      this.canvas.width += 0;

      this.ctx.save();
      this.ctx.scale(GU, GU);

      const colors = ['red', 'blue', 'yellow', 'purple'];

      const arrows = 30;
      for(var i = 1; i < arrows; i++) {
        const odd = i % 2 == 0;
        const x = -16/9*Math.cos(i + frame/500)*2 + 16/2;
        const y = -16/9*Math.sin(i + frame/500)*1.9 + 9/2;

        let rot = Math.atan((y-(9/2))/(x-(16/2)));
        rot += ((x>16/2) ? -90 : 90)*Math.PI/180;

        this.drawArrow(
          x,
          y,
          rot,
          0.3,
          colors[i % colors.length]);
      }

      // Draw seven
      this.ctx.fillStyle = '#BE9B75';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      const fontSize = smoothstep(5, 7, (frame-5480)/200);
      this.ctx.font = `${fontSize}px sans-serif`;
      this.ctx.fillText('7', 16 / 2, 9 / 2);

      this.ctx.restore();

    }

    drawArrow(x, y, radians, size, color) {
      const c = this.ctx;
      c.save();
      c.fillStyle = color;
      c.strokeStyle = color;
      c.translate(x,y);
      c.rotate(radians);
      c.beginPath();
      c.moveTo(0,0);
      c.lineTo(1*size, 1.5*size);
      c.lineTo(1*size, 2.5*size);
      c.lineTo(0*size, 1.0*size);
      c.lineTo(-1*size, 2.5*size);
      c.lineTo(-1*size, 1.5*size);
      c.closePath();
      c.fill();
      c.restore();
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

  global.sevenDisplay = sevenDisplay;
})(this);
