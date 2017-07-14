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
      this.img = Loader.loadTexture('res/seven.png');
      console.log(this.img.image);

      this.base_y = (9/2)-1.5; // GU = 1/9 height
    }

    update(frame) {
      super.update(frame);

      // This clears the canvas
      this.canvas.width += 0;
      this.ctx.save();
      this.ctx.scale(GU, GU);

      this.ctx.drawImage(this.img.image, 2, this.base_y, 3, 3);
      this.ctx.drawImage(this.img.image, 6.5, this.base_y, 3, 3);
      this.ctx.drawImage(this.img.image, 11, this.base_y, 3, 3);
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
