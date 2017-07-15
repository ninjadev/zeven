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
        images: [
          this.images[0],
          this.images[1],
          this.images[2],
          this.images[4],
          this.images[5],
          this.images[3]

        ]
      }
      this.wheel_two = {
        images: [
          this.images[3],
          this.images[5],
          this.images[2],
          this.images[1],
          this.images[4],
          this.images[0]
        ]
      }

      this.wheel_three = {
        images: [
          this.images[4],
          this.images[3],
          this.images[2],
          this.images[5],
          this.images[1],
          this.images[0]
        ]
      }
    }

    update(frame) {
      super.update(frame);
      // This clears the canvas
      this.canvas.width += 0;
      this.ctx.save();
      this.ctx.scale(GU, GU);

      const relativeFrame = frame - 5074;

      for (let i = 0; i < this.images.length; i++) {
        let offset = elasticOut(0, 95, 1, relativeFrame/130);
        this.ctx.drawImage(this.wheel_one.images[i].image, 2, (offset+i*4)%(4*this.images.length)-4, 3, 3);
      }

      //wheel to
      for (let i = 0; i < this.images.length; i++) {
        let offset = elasticOut(0, 23, 1, relativeFrame/115);
        this.ctx.drawImage(this.wheel_two.images[i].image, 6.5, (offset+i*4)%(4*this.images.length)-4, 3, 3);
      }

      for (let i = 0; i < this.images.length; i++) {
        let offset = elasticOut(0, 71, 1, relativeFrame/100);
        this.ctx.drawImage(this.wheel_three.images[i].image, 11, (offset+i*4)%(4*this.images.length)-4, 3, 3);
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
