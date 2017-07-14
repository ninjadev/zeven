(function(global) {
  class neonSevenNode extends NIN.THREENode {
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
      const c = this.ctx;
      super.update(frame);

      // This clears the canvas
      this.canvas.width += 0;


      this.ctx.save();
      this.ctx.scale(GU, GU);

      const base = ((frame / 30) % 6);

      // Draw Left chevron
      c.fillStyle = '#41648a';
      c.beginPath();
      this.chevron(-base +6);
      this.chevron(-base +4);
      this.chevron(-base +2);
      this.chevron(-base -0);
      this.chevron(-base -2);
      this.chevron(-base -4);
      this.chevron(-base -6);
      this.chevron(-base -8);
      this.chevron(-base -10);
      c.closePath();
      c.fill();

      // Draw right chevrons
      c.beginPath();
      this.chevron(-base +6, -1);
      this.chevron(-base +4, -1);
      this.chevron(-base +2, -1);
      this.chevron(-base +0, -1);
      this.chevron(-base -2, -1);
      this.chevron(-base -4, -1);
      this.chevron(-base -6, -1);
      this.chevron(-base -8, -1);
      this.chevron(-base -10, -1);
      c.closePath();
      c.fill();

      // Draw seven
      this.ctx.fillStyle = '#BE9B75';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.font = '9px Arial';
      this.ctx.fillText('7', 16 / 2, 9 / 2);

      this.ctx.restore();
    }

    chevron(x, direction=1) {
      const c = this.ctx;
      const height = 4;
      c.moveTo(8 + direction * (x        ), 4.5);
      c.lineTo(8 + direction * (x + 2    ), 4.5 + height);
      c.lineTo(8 + direction * (x + 2 + 1), 4.5 + height);
      c.lineTo(8 + direction * (x + 1    ), 4.5);
      c.lineTo(8 + direction * (x + 2 + 1), 4.5 - height);
      c.lineTo(8 + direction * (x + 2    ), 4.5 - height);
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

  global.neonSevenNode = neonSevenNode;
})(this);
