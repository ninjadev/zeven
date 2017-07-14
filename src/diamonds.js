(function(global) {
  class diamonds extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.circle = new THREE.Mesh(new THREE.SphereGeometry(10, 7, 7),
                                 new THREE.MeshBasicMaterial({ color: 0x000fff }));


      this.scene.add(this.circle);

      var light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(0, 0, -100);
      this.scene.add(light);

      this.camera.position.z = 300;
    }

    update(frame) {
      super.update(frame);

    }
  }

  global.diamonds = diamonds;
})(this);
