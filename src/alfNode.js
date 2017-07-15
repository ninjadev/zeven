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
      this.images = [
        Loader.loadTexture('res/slots/lemon.png'),
        Loader.loadTexture('res/slots/nin.png'),
        Loader.loadTexture('res/slots/seven.png'),
        Loader.loadTexture('res/slots/cherry.png'),
        Loader.loadTexture('res/slots/watermelon.png'),
        Loader.loadTexture('res/slots/bell.png')
      ]

      this.start_bean = song(37); // Bigger than this one
      this.end_bean = song(39); // Smaller than this

      this.wheel_one = {
        speed: 0,
        offset: -4,
      }
      this.wheel_two = {
        speed: 0.1,
      }

      this.wheel_three = {
        speed: 0.1,
      }
      this.speedModifier = 0;
    }

    update(frame) {
      super.update(frame);
      // This clears the canvas
      this.canvas.width += 0;
      this.ctx.save();
      this.ctx.scale(GU, GU);

      this.base_y = (frame/4)

      const relativeFrame = frame - 5074;
      const mixer = (relativeFrame) / 150;
      const speedModifier = lerp(1, 0.1, mixer);

      let from_absolute = relativeFrame / Math.log(relativeFrame); // -4, Max this.images.length*4

      for (let i = 0; i < this.images.length; i++) {
        this.wheel_one.offset = elasticOut(0, 95, 1, relativeFrame/120);
        this.ctx.drawImage(this.images[i].image, 2, (this.wheel_one.offset+i*4)%(4*this.images.length)-4, 3, 3);
      }

      //wheel to
      for (let i = 0; i < this.images.length; i++) {
        this.wheel_one.offset = elasticOut(0, 23, 1, relativeFrame/80);
        this.ctx.drawImage(this.images[i].image, 6.5, (this.wheel_one.offset+i*4)%(4*this.images.length)-4, 3, 3);
      }

      for (let i = 0; i < this.images.length; i++) {
        this.wheel_one.offset = elasticOut(0, 71, 1, relativeFrame/100);
        this.ctx.drawImage(this.images[i].image, 11, (this.wheel_one.offset+i*4)%(4*this.images.length)-4, 3, 3);
      }

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
