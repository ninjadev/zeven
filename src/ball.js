(function(global) {
  class ball extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.previousPosition = new THREE.Vector3();
      this.bloomThrob = 0;


      this.camera.near = 0.001;
      this.camera.fov = 25;
      this.camera.updateProjectionMatrix();

      this.windmillContainer = new THREE.Object3D();
      this.windmillContainer.scale.set(2, 2, 2);
      this.windmillContainer.position.x = -1.06;
      this.windmillContainer.position.y = 0;
      this.windmillContainer.position.z = 0.15;
      this.scene.add(this.windmillContainer);

      this.skybox = new THREE.Mesh(
          new THREE.BoxGeometry(50, 50, 50),
          new THREE.MeshBasicMaterial({
            color: 0x2b2b87,
            side: THREE.BackSide,
          }));
      this.scene.add(this.skybox);
      this.ballRadius = 0.025;
      this.skybox.position.y = 25 - this.ballRadius;
      this.ball = new THREE.Mesh(
        new THREE.SphereGeometry(this.ballRadius, 64, 64),
        new THREE.MeshBasicMaterial({
          color: 0xb00404,
        }));
      this.scene.add(this.ball);
      this.ball.position.set(
          1.18,
          0.143,
          .5);
      this.ball.velocity = new THREE.Vector3(0, 0, 0);
      this.ball.radius = this.ballRadius * 0.7;


      var prefix = 'res/ball/';

      var loadObject = function(objPath, material, cb) {
        var objLoader = new THREE.OBJLoader();
        Loader.loadAjax(objPath, function(text) {
          const obj = objLoader.parse(text);
          obj.traverse(child => {
            if (child instanceof THREE.Mesh) {
              child.material = material;
            }
          });
          cb(obj);
        }
        );
      };

      loadObject(prefix + 'path.obj',
        new THREE.MeshBasicMaterial({
          color: 0xe67327,
          side: THREE.DoubleSide,
        }), obj => {
          this.path = obj;
          this.path.scale.set(0.03, 0.03, 0.03);
          this.path.position.set(1., 0.06, 0.25);
          this.path.rotation.set(0, Math.PI / 2 * 1.1, 0);
          this.scene.add(this.path);
        });

      this.bumpers = [];
      loadObject(prefix + 'bumper.obj',
        new THREE.MeshBasicMaterial({
          color: 0xe67327,
          side: THREE.DoubleSide,
        }), obj => {
          this.bumpers[0] = obj;
          this.bumpers[1] = obj.clone();
          this.bumpers[2] = obj.clone();
          this.bumpers[1].children[0].material = this.bumpers[1].children[0].material.clone();
          this.bumpers[2].children[0].material = this.bumpers[2].children[0].material.clone();
          for(let i = 0; i < 3; i++) {
            this.bumpers[i].scale.set(0.02, 0.02, 0.02);
            this.bumpers[i].boom = 0;
            this.bumpers[i].radius = 0.025;
            const angle = i / 3 * Math.PI * 2;
            const distance = 0.1;
            this.bumpers[i].position.set(
                distance * Math.sin(angle),
                0,
                distance * Math.cos(angle));
            this.scene.add(this.bumpers[i]);
          }
        });

      loadObject(prefix + 'windmill_base.obj',
        new THREE.MeshBasicMaterial({
          color: 0xe67327,
          side: THREE.DoubleSide,
        }), obj => {
          this.windmill_base = obj;
          this.windmill_base.scale.set(0.01, 0.01, 0.01);
          this.windmillContainer.add(this.windmill_base);
        }
      );

      loadObject(prefix + 'windmill_blades.obj',
        new THREE.MeshBasicMaterial({
          color: 0xe67327,
          side: THREE.DoubleSide,
        }), obj => {
          this.windmill_blades = obj;
          this.windmill_blades.scale.set(0.01, 0.01, 0.01);
          this.windmill_blades.position.set(0, 0.105, 0);
          this.windmillContainer.add(this.windmill_blades);
        });

      this.track = new THREE.Mesh(
        new THREE.ParametricGeometry((u, v) => {
          return new THREE.Vector3(
            Math.sin(u * 20) * (.3 + v * .1),
            2 - u * 2,
            Math.cos(u * 20) * (.3 + v * .1)
          );
        }, 200, 200),
        new THREE.MeshBasicMaterial({ color: 0xe67327, side: THREE.DoubleSide })
      );
      this.scene.add(this.track);
    }

    update(frame) {
      super.update(frame);
      if(BEAN < 1776) {
        demo.nm.nodes.grading.noiseAmount = 0.3;
      } else {
        demo.nm.nodes.grading.noiseAmount = 0.08;
      }

      this.bloomThrob *= 0.9;
      if(BEAT && BEAN == 1776) {
        this.bloomThrob = 1;
      }

      demo.nm.nodes.grading.gammaCorrection = true;
      demo.nm.nodes.bloom.opacity = 0.5 + this.bloomThrob;
      //this.camera.position.x = 0;
      //this.camera.position.y = 0.5 * (0.8 - 0.75 * smoothstep(.5, 1, (frame - 4525) / (4799 - 4525)) + 2. * easeIn(0, 1, (frame - 4662) / (4799 - 4662)));

      if (BEAN < 35 * 12 * 4 + 12) {
        this.track.visible = true;
        this.windmillContainer.visible = false;
        if (this.path) this.path.visible = false;
        for (const bumper of this.bumpers) {
          bumper.visible = false;
        }
        if (BEAN < 33 * 12 * 4 + 12) {
          const startFrame = FRAME_FOR_BEAN(33 * 12 * 4);
          const t = (frame - startFrame) / (FRAME_FOR_BEAN(33 * 12 * 4 + 12) - startFrame);

          const acceleration = 1;
          const speed = acceleration * t;
          const y = speed * t;

          this.ball.position.set(
            0,
            3.025 - y,
            0.35
          );

        } else {
          const startFrame = FRAME_FOR_BEAN(33 * 12 * 4 + 12);
          const t = (frame - startFrame) / 60;

          this.ball.position.set(
            Math.sin(t * 2) * 0.35,
            2.025 - t * 0.2,
            Math.cos(t * 2) * 0.35
          );
        }

        if (!this.camera.isOverriddenByFlyControls) {
          const startFrame = FRAME_FOR_BEAN(33 * 12 * 4);
          const t = (frame - startFrame) / (FRAME_FOR_BEAN(33 * 12 * 4 + 12) - startFrame);

          this.camera.position.set(
            - t * 0.15,
            3.1 - t * 0.1,
            1.2 - t * 0.1
          );
          this.camera.lookAt(new THREE.Vector3(
            0,
            2.025 - t * 0.08,
            0.1
          ));
        }
      } else {
        this.track.visible = false;
        this.windmillContainer.visible = true;
        if (this.path) this.path.visible = true;
        for (const bumper of this.bumpers) {
          bumper.visible = true;
        }
        if(frame < 4902) {
          const step = (frame - 4245) / (4902 - 4245);
          this.ball.position.x = easeIn(1.18, 0.84, step);
          this.ball.position.y = lerp(0.143, 0.03, step);
          this.ball.position.z = easeOut(.5, 0.13, step);
          this.camera.position.x = Math.cos(frame / 50);
          this.camera.position.y = 0.3;
          this.camera.position.z = Math.sin(frame / 50);
          this.camera.lookAt(this.ball.position);
        } else if(frame < 4936) {

        }

        if(frame == 4902) {
          const back = 15;
          this.ball.position.set(-0.0119 + 0.0004 * back, 0, -0.03 * back);
          const speed = 0.75;
          this.ball.velocity.set(-0.00004 * speed, 0, 0.03 * speed);
        }

        if(frame <= 4937) {
          this.ball.position.set(-0.0119, 0, -0.00);
          this.ball.velocity.set(-0.00004, 0, 0.03);
        }
        if(frame == 4970) {
          this.ball.position.set(-0.0119, 0, -0.00);
          this.ball.velocity.set(-0.00004, 0, 0.03);
        }
        if(frame == 4988) {
          this.ball.position.set(-0.0119, 0, -0.00);
          this.ball.velocity.set(-0.00004, 0, 0.03);
        }
        if(frame >= 4936 && frame < 4970) {
          this.camera.position.x = 0.4 * Math.cos(4245);
          this.camera.position.y = 0.4;
          this.camera.position.z = 0.4 * Math.sin(4245);
          this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        }
        if(frame >= 4970 && frame < 4988) {
          this.camera.position.x = 0.4 * Math.cos(4973);
          this.camera.position.y = 0.2;
          this.camera.position.z = 0.4 * Math.sin(4973);
          this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        }
        if(frame >= 4988 && frame < 5016) {
          this.camera.position.x = 0.4 * Math.cos(4988);
          this.camera.position.y = 0.7;
          this.camera.position.z = 0.4 * Math.sin(4988);
          this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        }
        if(frame == 5016) {
          this.ball.position.set(
              this.windmillContainer.position.x + 0.6,
              0,
              this.windmillContainer.position.z);
          this.ball.velocity.set(-0.025, 0, 0);
        }
        if(frame >= 5016 && frame < 5200) {
          this.camera.position.set(
            0.4057971617455087,
            0.7945663960534218,
            -0.13085577464572953);
          this.camera.rotation.set(
            -2.0465180443167004,
             1.0442813920204983,
             2.108188437918908);
        }

        if(this.windmill_blades) {
          this.windmill_blades.rotation.set(Math.PI/2 * frame / 100, 0, 0);
        }

        if(this.ball) {
          this.ball.position.add(this.ball.velocity);
          this.ball.velocity.multiplyScalar(0.975);
          for(let i = 0; i < this.bumpers.length; i++) {
            const bumper = this.bumpers[i];
            bumper.boom *= 0.9;
            bumper.position.y = -0.02 * bumper.boom;
            bumper.children[0].material.color.setRGB(
              bumper.boom > 0.7 ? 1 : 0.9019607843137255,
              bumper.boom > 0.7 ? 1 : 0.4470588235294118,
              bumper.boom > 0.7 ? 1 : 0.15294117647058825);
            const delta = this.ball.position.clone().add(bumper.position.clone().negate());
            delta.y = 0;
            const minimumDistance = this.ball.radius + bumper.radius;
            const distance = delta.length();
            if(distance < minimumDistance) {
              bumper.boom = 1;
              this.ball.position.add(delta.normalize().multiplyScalar((minimumDistance - distance) * 1.0001));
              const normal = delta.normalize();
              this.ball.velocity = this.ball.velocity.clone().add(normal.clone().multiplyScalar(normal.clone().dot(this.ball.velocity) * 2).negate());
              //this.ball.velocity.negate();
              if(frame < 4940) {
                this.ball.velocity.add(normal).multiplyScalar(0.008);
              } else {
                this.ball.velocity.add(normal).multiplyScalar(0.02);
              }
            }
          }
        }
      }
    }
  }

  global.ball = ball;
})(this);
