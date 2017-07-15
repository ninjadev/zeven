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
        'desire',
        'farbrausch',
        'cocoon',  
        'sandsmark',  
        'mrdoob',
        'darklite',
        'excess',
        'indigo',
        'relapse',
        'still',
        'nerdartz',
        'primitive',
        'placid',
        'kvasigen',
        'gargaj',
        'ephidrena',
        'rgba',
        'outracks',
        'panda cube',
        'relapse',
        'fnuque',
      ];
    }

    update(frame) {
      this.frame = frame;
    }

    render(renderer) {

      let x = this.ctx;
      let R = (r,g,b,a) => `rgba(${r==undefined?0:r|0}, ${g==undefined?0:g|0}, ${b==undefined?0:b|0}, ${a==undefined?1:a})`;
      let t = this.frame / 60;
      let S = x => Math.sin(x);
      let C = x => Math.cos(x);
      let T = x => Math.tan(x);

      this.name = this.names[((BEAN - 2352) / 12) | 0];

      this.ctx.fillStyle = '#020916';
      this.ctx.fillRect(0, 0, 16 * GU, 9 * GU);

      demo.nm.nodes.bloom.opacity = .1;
      demo.nm.nodes.grading.gammaCorrection = true;

      this.ctx.textBaseline = 'middle';
      this.ctx.textAlign = 'center';
      this.ctx.font = 'bold 60pt Arial';
      this.ctx.save();
      this.ctx.scale(16 / 1920 * GU, 16 / 1920 * GU);
      if(BEAN < 2352 + 48 * 2) {
        let W, F, i, n, m;
        (F=Z=>{
          for(x.fillStyle=R(W=1/Z*4e3,W/2,W/4),
              i=Z*Z*2;n=i%Z,m=i/Z|0,
              i--;
              n%2^m%2&&x.fillRect((n-t%2-1)*W,
              (S(t)+m-1)*W,W,W),
              Z==6&& n%2^m%2&& (
                x.save(),
                x.fillStyle='#020916',
                x.fillText(this.name,(n-t%2-1+0.5)*W,W*(S(t)+m-1+.5)),
                x.restore()
              ));
          Z&&F(Z-6);
        })(36);
      } else if(BEAN < 2532) {
        let i, s, j, W;
        x.fillStyle='#020916';
        x.fillRect(0, 0, 1920, 1080);
        for(i=9;i<2e3;i+=2){
          const Z = Math.pow(i / 2e3, 2) * 36;
          x.strokeStyle=R(W = 1/Z*4e3,W/2,W/4);
          s=3/(9.1-(t+i/99)%9),x.beginPath(),j=i*7+S(i*4+t+S(t)),x.lineWidth=s*s,x.arc(960,540,s*49,j,j+.6),x.stroke();
        }
        x.fillStyle=R(W = 1/6*4e3,W/2,W/4);
        const y = Math.sin(this.frame / 60 / 60 * 105) * 1080 / 4 + 1080 / 2 - 1080 / 3 / 2;
        x.fillRect(0, y, 1920, 1080 / 3);
        x.fillStyle = '#020916';
        x.fillText(this.name, 960, y + 1030 / 6);
      } else if(BEAN < 2544) {
        let a, s, d, i, h;
        a=13;for(i=0;i++<1e3;)s=45/(9-(t+i/99)%9),x.fillStyle=R((d=i*119)%256,d/1.4%256,d/7%256),x.fillRect(960+5*s*C(h=i*a+t),540+5*s*S(h),s,s);
        x.fillStyle = 'white';
        x.fillText(this.name, 2 * 1920 / 3, 2 * 1080 / 3);
      } else if(BEAN < 2556) {
        let a, w, n, i, d, z;
        this.ctx.save();
        this.ctx.scale(1920 / 64, 1920 / 64);
        a=Math.abs;w=64;for(n=i=2304;i--;)d=a(i%w-32)+a(i/w-19),x.fillStyle=R(n*S(z=d/6-t*2),n*S(z-2),n*S(z-4)),x.fillRect(i%w,0|i/w,1,1);
        this.ctx.restore();
        x.fillStyle = '#020916';
        x.fillText(this.name, 1920 / 2, 1080 / 2);
      } else if(BEAN < 2568) {
        let a, n, i, d, X, y, z;
        a=P=>Math.abs(P-5);for(n=i=255;i--;)d=a(X=i%11)+a(y=i/11|0),x.fillStyle=R(n*S(z=d/2-t*2),n*S(z-2),n*S(z-4)),x.fillRect(420+99*X,99*y,90,90);
        x.save();
        x.fillStyle = 'white';
        x.translate(200, 2 * 1080 / 3);
        x.rotate(-Math.PI / 2);
        x.fillText(this.name, 0, 0);
        x.restore();
      } else if(BEAN < 2580) {
        this.ctx.save();
        this.ctx.scale(1920 / 64, 1920 / 64);
        let a, w, i, d, z;
        a=Math.abs;w=64;for(i=-1;i++<2304;)d=a(i%w-32)+a(i/w-19),z=d*6-t*3,x.fillStyle=R(i*S(z),i*S(z-2),i*S(z-4)),x.fillRect(i%w,0|i/w,1,1);
        this.ctx.restore();
        x.fillStyle = 'white';
        x.strokeStyle = '#020916';
        x.lineWidth = 30;
        x.strokeText(this.name, 1920 / 3, 2 * 1080 / 3);
        x.fillText(this.name, 1920 / 3, 2 * 1080 / 3);
      } else if(BEAN < 2592) {
        let i, j, A, W;
        this.ctx.save();
        this.ctx.scale(1920 / 960, 1920 / 960);
        x.fillStyle=R(W = 1/18*4e3,W/2,W/4);
        for(i=20;i--;)for(j=12;j--;)x.beginPath(),x.arc(50*i-9*S(A=4*t+i*C(t/8)*.6+j*S(t/8)*.4),50*j+9*C(A),19+C(A)/.4,0,7),x.fill();
        this.ctx.restore();
        x.fillStyle = 'white';
        x.strokeStyle = '#020916';
        x.lineWidth = 30;
        x.strokeText(this.name, 2 * 1920 / 3, 1080 / 3);
        x.fillText(this.name, 2 * 1920 / 3, 1080 / 3);
      } else if(BEAN < 2604) {
        let i, p, d, W;
        x.fillStyle=R(W = 1/18*4e3,W/2,W/4);
        for(i=8e3;i--;)p=3*t+i/9e3+i%4/.637,d=C(p)-S(p),d>0&&x.fillRect(999+149*S(p)+790*S(t+i/9e3+i%3*4.5),i/6-2,149*d,2/(d+1));
        x.fillStyle = 'white';
        x.strokeStyle = '#020916';
        x.lineWidth = 30;
        x.strokeText(this.name, 1920 / 3, 1080 / 3);
        x.fillText(this.name, 1920 / 3, 1080 / 3);
      } else if(BEAN < 2611) {
        let i;
        for(i=132;i--;){x.fillStyle=R(-59*T(1.7*t-.02*i),0,159*S(t-.01*i));x.fillRect(960+6*S(i+.5*T(t))*i,540+6*C(i+t)*i,i,i);}
      } else if(BEAN < 2640) {
        let j, i, a;
        this.ctx.save();
        this.ctx.scale(1920 / 960, 1920 / 960);
        for(j=64;j--;)for(i=120;i--;)a=1+S((i^j)/9+4*t|0),x.fillStyle=R(a*30,160-a*30,a*50+30*S(t),a/2),x.fillRect(i<<4,j<<4,16,16);
        this.ctx.restore();
        x.fillStyle = 'white';
        x.strokeStyle = '#020916';
        x.lineWidth = 30;
        let A;
        let offset = 0;
        if(BEAN < 2592 + 12 + 12 + 4) {
          A = [
            'truck',
            'rohtie',
            'T-101',
            'solskogen crew',
          ];
        } else if(BEAN < 2592 + 12 + 12 + 12) {
          A = [
            'Kewlers',
            'odd',
            'logicoma',
            'mercury ',
          ];
          offset = 1;
        } else {
          A = [
          'idle',
          'lft ',
          'proximity',
          'p01',
         ];
          offset = 2;
        }

        x.textAlign = 'left';
        for(let i = 0; i < 4; i++) {
          x.strokeText(A[i], offset * 500 + 200 + 50 * i, 245 + 200 * i);
          x.fillText(A[i], offset * 500 + 200 + 50 * i, 245 + 200 * i);
        }
      } else {
        let i, j;
        for(i=9;i--;)for(j=9;j--;)x.beginPath(),x.arc(i*250+S(t*i)*99, j*99+C(t*j)*99,50,0,7),x.fillStyle=R(S(t*j)*999,0,99),x.fill()
      }

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
