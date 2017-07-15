(function(global) {
  class alfNode extends NIN.THREENode {
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
      this.seven = Loader.loadTexture('res/seven.png');
      this.lemon = Loader.loadTexture('res/lemon.png');
    }

    update(frame) {
      super.update(frame);

      // This clears the canvas
      this.canvas.width += 0;
      this.ctx.save();
      this.ctx.scale(GU, GU);

      this.base_y = (frame/4)

      // wheel one

      this.ctx.drawImage(this.seven.image, 2, this.base_y % 14.8-3, 3, 3);
      this.ctx.drawImage(this.seven.image, 6.5, this.base_y % 14.8-3, 3, 3);
      this.ctx.drawImage(this.seven.image, 11, this.base_y % 12.5-3, 3, 3);

      this.ctx.drawImage(this.lemon.image, 2, this.base_y % 22-3, 3, 3);
      this.ctx.drawImage(this.lemon.image, 6.5, this.base_y % 9.3-3, 3, 3);
      this.ctx.drawImage(this.lemon.image, 11, this.base_y % 14.3-3, 3, 3);
      this.ctx.restore();
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

  global.alfNode = alfNode;
})(this);
