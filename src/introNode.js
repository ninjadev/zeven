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

      this.ctx.fillStyle = 'red';
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
