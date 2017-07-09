(function(global) {
  class ball extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      const texture = new THREE.CanvasTexture(this.createBackground());
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(16, 1);

      const wall = new THREE.Mesh(
        new THREE.CylinderGeometry(50, 50, 100, 50),
        new THREE.MeshBasicMaterial({
          side: THREE.BackSide,
          map: texture,
        })
      );
      this.scene.add(wall);

      this.ball = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32),
                                 new THREE.MeshStandardMaterial({ color: 0x000fff }));
      this.scene.add(this.ball);

      this.track = new THREE.Mesh(
        new THREE.ParametricGeometry((u, v) => {
          return new THREE.Vector3(
            Math.sin(u * 20) * (5 + v),
            20 - u * 20,
            Math.cos(u * 20) * (5 + v)
          );
        }, 200, 200),
        new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide })
      );
      this.scene.add(this.track);

      var light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(0, 50, 0);
      this.scene.add(light);
    }

    update(frame) {
      super.update(frame);

      if (BEAN < 34 * 12 * 4) {
        const startFrame = FRAME_FOR_BEAN(33 * 12 * 4);
        const t = (frame - startFrame) / 60;

        this.ball.position.set(
          0,
          30.5 - 10 * t,
          5.5
        );
      } else if (BEAN < 40 * 12 * 4) {
        const startFrame = FRAME_FOR_BEAN(34 * 12 * 4);
        const t = (frame - startFrame) / 60;

        this.ball.position.set(
          Math.sin(t) * 5.5,
          20.5 - t,
          Math.cos(t) * 5.5
        );

        if (!this.camera.isOverriddenByFlyControls) {
          const cameraT = t - 1;
          this.camera.position.set(
            Math.sin(cameraT) * 5.5,
            21 - cameraT,
            Math.cos(cameraT) * 5.5
          );
          this.camera.lookAt(new THREE.Vector3(
            Math.sin(t) * 5.5,
            20.5 - t,
            Math.cos(t) * 5.5
          ));
        }
      }
    }

    createBackground() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#aaffaa';
      ctx.fillRect(0, 0, 256, 512);
      ctx.fillStyle = '#aaaaff';
      ctx.fillRect(256, 0, 512, 512);
      return canvas;
    }
  }

  global.ball = ball;
})(this);
