(function(global) {
  class templeScene extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      let skyboxmap = Loader.loadTexture('res/checkered-skybox.png');

      this.skyboxmaterial = new THREE.MeshBasicMaterial({
          map: skyboxmap,
          metalness: 0.1,
          roughness: 0.9,
        }),

      this.cube = new THREE.Mesh(new THREE.PlaneGeometry(300, 150),
                                 this.skyboxmaterial);
      this.scene.add(this.cube);

      var light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      this.camera.position.z = 100;
    }

    update(frame) {
      super.update(frame);

      var startBEAN = 48*4;
      var relativeFrame = frame - FRAME_FOR_BEAN(startBEAN);

      this.cube.rotation.x = 0;//Math.sin(frame / 10);
      this.cube.rotation.y = 0;//Math.cos(frame / 10);

      this.cube.position.y = -33 + 150/40 * Math.floor(relativeFrame / FRAME_FOR_BEAN(48/12));
    }
  }

  global.templeScene = templeScene;
})(this);
