(function(global) {
  class ball extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.previousPosition = new THREE.Vector3();

      this.camera.near = 0.001;
      this.camera.fov = 25;
      this.camera.updateProjectionMatrix();

      this.skybox = new THREE.Mesh(
          new THREE.BoxGeometry(50, 50, 50),
          new THREE.MeshBasicMaterial({
            color: 0x3860a0,
            side: THREE.BackSide,
          }));
      this.scene.add(this.skybox);

      this.ballRadius = 0.025;
      this.ball = new THREE.Mesh(
        new THREE.SphereGeometry(this.ballRadius, 64, 64),
        new THREE.MeshStandardMaterial({
          metalness: 0.9,
          roughness: 0.2,
          map: Loader.loadTexture('res/checkered-skybox.png'),
          roughnessMap: Loader.loadTexture('res/rock_cliffs.jpg'),
        }));
      this.scene.add(this.ball);

      this.scene.fog = new THREE.Fog( 0xffffff, 1, 5000 );
      this.scene.fog.color.setHSL( 0.6, 0, 1 );

      const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1);
      hemiLight.color.setHSL( 0.6, 1, 0.6 );
      hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
      hemiLight.position.set( 0, 500, 0 );
      this.scene.add(hemiLight);

      const dirLight = new THREE.DirectionalLight( 0xffffff, 1);
      dirLight.color.setHSL( 0.1, 1, 0.95 );
      dirLight.position.set( -1, 1.75, 1 );
      dirLight.position.multiplyScalar( 50 );
      this.scene.add(dirLight);

      var prefix = 'res/ball/';



      var loadObject = function(objPath, material, three_object, num_instances) {
        var objLoader = new THREE.OBJLoader();
        Loader.loadAjax(objPath, function(text) {
          var object = [];
          for (var i = 0; i < num_instances; i++)
          {
            object.push(objLoader.parse(text));
            object[i].traverse(function(child) {
              if (child instanceof THREE.Mesh) {
                  child.material = material;
              }
            });
          }
          for (var i = 0; i < num_instances; i++)
          {
            three_object[i].add(object[i]);
          }
        }
        );
      };

      this.path = [];
      this.path.push(new THREE.Object3D());
      loadObject(prefix + 'path.obj',
        new THREE.MeshStandardMaterial({
          color: 0x444454,
          side: THREE.DoubleSide,
          roughness: 1
        }),
        this.path, 1
      );
      this.path[0].scale.set(0.03, 0.03, 0.03);
      this.path[0].position.set(0, 0.06, 0.01);
      this.path[0].rotation.set(0, Math.PI, 0);
      this.scene.add(this.path[0]);

      this.bumper = [];
      this.bumper.push(new THREE.Object3D());
      loadObject(prefix + 'bumper.obj',
        new THREE.MeshStandardMaterial({
          color: 0x444454,
          side: THREE.DoubleSide,
          roughness: 1
        }),
        this.bumper, 1
      );
      this.bumper[0].scale.set(0.02, 0.02, 0.02);
      this.bumper[0].position.set(0.03, 0, 0);
      this.scene.add(this.bumper[0]);

      this.windmill_base = [];
      this.windmill_base.push(new THREE.Object3D());
      loadObject(prefix + 'windmill_base.obj',
        new THREE.MeshStandardMaterial({
          color: 0x444454,
          side: THREE.DoubleSide,
          roughness: 1
        }),
        this.windmill_base, 1
      );
      this.windmill_base[0].scale.set(0.01, 0.01, 0.01);
      this.windmill_base[0].position.set(-0.06, 0, 0.15);
      this.scene.add(this.windmill_base[0]);

      this.windmill_blades = [];
      this.windmill_blades.push(new THREE.Object3D());
      loadObject(prefix + 'windmill_blades.obj',
        new THREE.MeshStandardMaterial({
          color: 0x444454,
          side: THREE.DoubleSide,
          roughness: 1
        }),
        this.windmill_blades, 1
      );
      this.windmill_blades[0].scale.set(0.01, 0.01, 0.01);
      this.windmill_blades[0].position.set(-0.06, 0.105, 0.15);

      this.scene.add(this.windmill_blades[0]);
    }

    update(frame) {
      super.update(frame);
      this.camera.position.set(0.7, 0.2, 0);


      this.ball.position.x = 0.05 * Math.sin(frame / 20);
      this.ball.position.y = 0;
      this.ball.position.z = 0.05 * Math.cos(frame / 20);
      this.camera.lookAt(new THREE.Vector3(0, 0.1, 0));

      this.previousPosition.negate().add(this.ball.position).length();
      this.ball.rotation.z -= 2 * this.previousPosition.x / this.ballRadius / Math.PI;
      this.ball.rotation.x += 2 * this.previousPosition.z / this.ballRadius / Math.PI;
      this.previousPosition.copy(this.ball.position);

      this.windmill_blades[0].rotation.set(Math.PI/2 * frame / 100, 0, 0);
    }
  }

  global.ball = ball;
})(this);
