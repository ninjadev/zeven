(function(global) {
  class mntn extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput(),
          sunpos: new NIN.Output(),
        },
        inputs: {
          mntngeom: new NIN.Input()
        }
      });

      //TODO: get from input
      this.mntnWidth = 512;
      this.mntnHeight = 512;
      this.mntnSizeX = 2000;
      this.mntnSizeY = 2000;

      this.initialized = false;

      this.throb = 0;
    }

    render(renderer) {
      demo.nm.nodes.grading.gammaCorrection = true;
      super.render(renderer);
    }

    delayedInit() {

      //Skybox
      var materialArray = [];
      materialArray.push(new THREE.MeshBasicMaterial( { map: Loader.loadTexture( 'res/skyboxsun25deg/1.jpg' ) })); //right
      materialArray.push(new THREE.MeshBasicMaterial( { map: Loader.loadTexture( 'res/skyboxsun25deg/4.jpg' ) })); //left
      materialArray.push(new THREE.MeshBasicMaterial( { map: Loader.loadTexture( 'res/skyboxsun25deg/3.jpg' ) })); //top
      materialArray.push(new THREE.MeshBasicMaterial( { map: Loader.loadTexture( 'res/skyboxsun25deg/6.jpg' ) })); //bottom
      materialArray.push(new THREE.MeshBasicMaterial( { map: Loader.loadTexture( 'res/skyboxsun25deg/5.jpg' ) }));
      materialArray.push(new THREE.MeshBasicMaterial( { map: Loader.loadTexture( 'res/skyboxsun25deg/2.jpg' ) }));

      for (var i = 0; i < 6; i++)
        materialArray[i].side = THREE.BackSide;
      var skyboxMaterial = new THREE.MeshFaceMaterial( materialArray );

      var skyboxMesh  = new THREE.Mesh( 
          new THREE.BoxGeometry( 7777, 7777, 7777 ),
          skyboxMaterial );

      this.scene.add(skyboxMesh);

      var shaderMat = new THREE.ShaderMaterial(SHADERS['PerlinMntn']).clone();
      var tCliff  = Loader.loadTexture('res/rock_cliffs.jpg');
      tCliff.wrapS = THREE.RepeatWrapping;
      tCliff.wrapT = THREE.RepeatWrapping;

      shaderMat.uniforms.tCliff.value = tCliff;

      this.mntn = new THREE.Mesh( this.inputs.mntngeom.getValue(),
         // material);
          //new THREE.MeshPhongMaterial({ map:mapTexture}));
          //new THREE.MeshPhongMaterial({ wireframe:true}));
         // new THREE.MeshNormalMaterial());
       shaderMat);

      this.mntn.castShadow = true;
      this.mntn.receiveShadow = true;

      this.scene.add(this.mntn);

      //GoPro HERO5  FOV :)
      this.camera = new THREE.PerspectiveCamera(118.2, 16/9, 1, 50000);

      this.camera.position.x = 0;
      this.camera.position.y = -70;
      this.camera.position.z = 90;
      this.camera.rotation.x = -3.14/8;
    }

    projectPoint(x, y, z) {
      var p = new THREE.Vector3(x, y, z);
      var vector = p.project(this.camera);

      vector.x = (vector.x + 1) / (2 * 16 * GU);
      vector.y = -(vector.y - 1) / (2 * 9 * GU);

      return vector;
    }

    update(frame) {
      super.update(frame);
      this.camera.fov = easeOut(25, 118.2, (frame - 4008 + 12) / 24);
      this.camera.updateProjectionMatrix();

      if(!this.initialized && this.inputs.mntngeom.getValue()){
        this.delayedInit();
        this.initialized = true;
      }
      if(!this.initialized){
        return;
      }


      if(BEAN < 1248) {
        const step = (frame - 3428) / (3565 - 3428);
        this.camera.position.x = lerp(700, 700, step);
        this.camera.position.y = smoothstep(1000, 1000, step);
        this.camera.position.z = lerp(700, 400, step);
        this.camera.rotation.set(-3.14 / 8, 0, 0);
      } else if (BEAN < 1248 + 48 + 48) {
        const step = (frame - 3565) / (3839 - 3565);
        this.camera.rotation.set(0, 0, 0);
        this.camera.position.x = easeOut(800, 780, step);
        this.camera.position.y = easeIn(950, 980, step);
        this.camera.position.z = lerp(500, -300, step);
        this.camera.rotation.set(-3.14 / 16, 0, 0);
      } else if (BEAN < 1248 + 48 + 48 + 48 + 48 + 48) {
        const step = (frame - 3839) / (4250 - 3839);
        this.camera.position.x = easeOut(0, -180, step);
        this.camera.position.y = lerp(0, 280, step) + easeIn(870, 1080 - 280, step);
        this.camera.position.z = lerp(-800, -400, step);
        this.camera.rotation.set(0, Math.PI / 2, 0);
      }

      var sunPos = this.projectPoint(5000.0, 2660.0, -5000.0);

      if(this.outputs.sunpos){
        this.outputs.sunpos.setValue(sunPos);
      }
    }
  }


  global.mntn = mntn;
})(this);
