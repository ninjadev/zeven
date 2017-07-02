(function(global) {
  class ball extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

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

      const startFrame = 4570;
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

  global.ball = ball;
})(this);
