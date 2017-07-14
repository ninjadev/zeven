(function(global) {
  class dweet extends NIN.Node {
    constructor(id, options) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.texture = new THREE.Texture(this.canvas);
      this.texture.magFilter = THREE.LinearFilter;
      this.texture.minFilter = THREE.LinearFilter;

      this.names = [
        'FARBRAUSCH',
        'DES!RE',
        'TRSi',
        'OUTRACKS',
        'MRDOOB',
      ];
    }

    update(frame) {
      this.frame = frame;
    }

    render(renderer) {

      let x = this.ctx;
      let R = (r,g,b,a) => `rgba(${r==undefined?0:r|0}, ${g==undefined?0:g|0}, ${b==undefined?0:b|0}, ${a==undefined?1:a})`;
      let W, F, i, n, m;
      let t = this.frame / 60;
      let S = x => Math.sin(x);

      this.ctx.fillStyle = '#020916';
      this.ctx.fillRect(0, 0, 16 * GU, 9 * GU);

      demo.nm.nodes.bloom.opacity = .1;
      demo.nm.nodes.grading.gammaCorrection = true;

      this.ctx.textBaseline = 'middle';
      this.ctx.textAlign = 'center';
      this.ctx.font = 'bold 60pt Arial';
      this.ctx.save();
      this.ctx.scale(16 / 1920 * GU, 16 / 1920 * GU);
      (F=Z=>{
        for(x.fillStyle=R(W=1/Z*4e3,W/2,W/4),
            i=Z*Z*2;n=i%Z,m=i/Z|0,
            i--;
            n%2^m%2&&x.fillRect((n-t%2-1)*W,
            (S(t)+m-1)*W,W,W),
            Z==6&& n%2^m%2&& (
              x.save(),
              x.fillStyle='#020916',
              x.fillText(this.names[(this.names.length * 9999 -(t/Math.PI|0) - n)%this.names.length],(n-t%2-1+0.5)*W,W*(S(t)+m-1+.5)),
              x.restore()
            ));
        Z&&F(Z-6);
      })(36);

      this.ctx.restore();

      this.texture.needsUpdate = true;
      this.outputs.render.setValue(this.texture);
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }
  }

  global.dweet = dweet;
})(this);
