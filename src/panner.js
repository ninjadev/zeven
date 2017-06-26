(function(global) {
  class panner extends NIN.THREENode {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        },
        inputs: {
          image: new NIN.TextureInput()
        }
      });

      this.plane = new THREE.Mesh(
          new THREE.BoxGeometry(5, 5, 5),
          new THREE.MeshBasicMaterial({color: 0xffffff}));
      this.scene.add(this.plane);

      this.camera = new THREE.OrthographicCamera(
        1 / - 2, 1 / 2, 1 / 2, 1 / - 2, 1, 1000);

      this.plane.rotation.x = Math.PI / 2;
      this.camera.position.z = 10;
    }

    update(frame) {
      super.update(frame);
      this.plane.material.map = this.inputs.image.getValue();
      this.camera.position.x = 2 * Math.sin(frame / 200);
      this.camera.position.y = 2 * Math.cos(frame / 200);
    }
  }

  global.panner = panner;
})(this);
