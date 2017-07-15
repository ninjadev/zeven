(function(global) {
  class ninEnd extends NIN.Node {
    constructor(id, options) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.canvas.width = 16 * GU; 
      this.canvas.height = 9 * GU; 
      this.output = new THREE.VideoTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;


      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);

      this.cameraX = 0;
      this.cameraY = 0;
      this.cameraDX = 0;
      this.cameraDY = 0;
      this.cameraDDX = 0;
      this.cameraDDY = 0;


      var light = new THREE.PointLight( 0xffffff, 1, 100 );
      light.position.set( -50, -50, -50 );
      this.scene.add(light);

      var pointLight = new THREE.PointLight(0xFFFFFF);
      pointLight.position.x = 10;
      pointLight.position.y = 50;
      pointLight.position.z = 130;
      this.scene.add(pointLight);

      this.camera.position.z = 100;
      this.frame = 0;

      this.black = '#000000';
      this.white = '#ffffff';
      this.blank = 'rgba(0,0,0,0)';
      this.initiate();
      this.resize();
    }

    resize() {
      super.resize();
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }

    update(frame) {
      demo.nm.nodes.bloom.opacity = 0.6;
      this.frame = frame;
      var startBEAN = 78 * 12 * 4;
      var startFrame = FRAME_FOR_BEAN(startBEAN);
      let t = 0;
      if (BEAN >= startBEAN + 1) {
        t = frame - FRAME_FOR_BEAN(startBEAN + 1);
        this.sizeNIN = lerp(0.5, 1.5, t/10);
      }
      if (BEAN >= startBEAN + 9) {
        t = frame - FRAME_FOR_BEAN(startBEAN + 9);
        this.sizeJA = lerp(0.5, 1.5, t/10);
      }
      if (BEAN >= startBEAN + 9 + 8) {
        t = frame - FRAME_FOR_BEAN(startBEAN + 9 + 8);
        this.sizeDEV = lerp(0.5, 1.5, t/10);
      }

      if (frame < FRAME_FOR_BEAN(startBEAN) + 1) {
        this.initiate();
      }
      if (BEAT) {
        if (BEAN == startBEAN + 1) {
          this.colorNIN = this.black;
        }
        if (BEAN == startBEAN + 9) {
          this.colorJA = this.black;
        }
        if (BEAN == startBEAN + 9 + 8) {
          this.colorDEV = this.black;
        }
      }
      this.overlayAlpha = lerp(0, 1, (frame - FRAME_FOR_BEAN(12 * 4 * 81 + 30)) / 50);
      this.rotator = smoothstep(0, -.2, (frame - FRAME_FOR_BEAN(12 * 4 * 79)) / 200);

      this.cameraDDX += -this.cameraDX * 0.9 + (Math.random() - 0.5) * smoothstep(0, 1, (frame-startFrame)/100)/4;
      this.cameraDDY += -this.cameraDY * 0.9 + (Math.random() - 0.5) * smoothstep(0, 1, (frame-startFrame)/100)/4;
      this.cameraDX = - this.cameraX * 0.5;
      this.cameraDY = - this.cameraY * 0.5;
      this.cameraDX *= 0.5;
      this.cameraDY *= 0.5;
      this.cameraDX += this.cameraDDX;
      this.cameraDY += this.cameraDDY;
      this.cameraX += this.cameraDX;
      this.cameraY += this.cameraDY;
      this.cameraX *= 0.5;
      this.cameraY *= 0.5;
    }

    render() {
      this.ctx.fillStyle = this.bgcolor;
      this.ctx.fillRect(0, 0, 16*GU, 9*GU);

      this.ctx.save();
      this.ctx.translate(8*GU, 4.5*GU);
      this.ctx.scale(this.sizeNIN, this.sizeNIN);
      this.ctx.translate(-8*GU, -4.5*GU);

      this.ctx.translate(this.cameraX * GU, this.cameraY * GU);

      this.ctx.fillStyle = this.colorNIN;
      this.ctx.font = 'bold ' + (1.5 * GU) + 'pt oldfont';
      this.ctx.textAlign = 'left';
      this.ctx.textBaseline = 'middle';

      this.ctx.fillText('NIN', 3.8 * GU, 4.5 * GU);

      this.ctx.restore();
      this.ctx.save();
      
      this.ctx.translate(8*GU, 4.5*GU);
      this.ctx.scale(this.sizeJA, this.sizeJA);
      this.ctx.translate(-8*GU, -4.5*GU);

      this.ctx.translate(this.cameraX * GU, this.cameraY * GU);
      
      this.ctx.fillStyle = this.colorJA;
      this.ctx.font = 'bold ' + (1.5 * GU) + 'pt oldfont';
      this.ctx.textAlign = 'left';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText('JA', 6.7 * GU, 4.5 * GU);

      this.ctx.restore();
      this.ctx.save();
      
      this.ctx.translate(8*GU, 4.5*GU);
      this.ctx.scale(this.sizeDEV, this.sizeDEV);
      this.ctx.translate(-8*GU, -4.5*GU);

      this.ctx.translate(this.cameraX * GU, this.cameraY * GU);
      
      this.ctx.fillStyle = this.colorDEV;
      this.ctx.font = 'bold ' + (1.5 * GU) + 'pt oldfont';
      this.ctx.textAlign = 'left';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText('DEV', 9.0 * GU, 4.5 * GU);

      this.ctx.restore();

      this.ctx.fillStyle = `rgba(0,0,0,${this.overlayAlpha})`;
      this.ctx.fillRect(0, 0, 16 * GU, 9 * GU);

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }

    initiate() {
      this.bgcolor = this.white;
      this.colorNIN = this.blank;
      this.colorJA = this.blank;
      this.colorDEV = this.blank;
      this.sizer = 1;
    }
  }

  global.ninEnd = ninEnd;
})(this);
