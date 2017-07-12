(function(global) {
  class mntn extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
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
    }

    render(renderer) {
      demo.nm.nodes.grading.gammaCorrection = true;
      super.render(renderer);
    }

    delayedInit() {

      //Skybox
      var materialArray = [];
      materialArray.push(new THREE.MeshBasicMaterial( { map: Loader.loadTexture( 'res/skyboxsun25deg/1.bmp' ) })); //right
      materialArray.push(new THREE.MeshBasicMaterial( { map: Loader.loadTexture( 'res/skyboxsun25deg/4.bmp' ) })); //left
      materialArray.push(new THREE.MeshBasicMaterial( { map: Loader.loadTexture( 'res/skyboxsun25deg/3.bmp' ) })); //top
      materialArray.push(new THREE.MeshBasicMaterial( { map: Loader.loadTexture( 'res/skyboxsun25deg/6.bmp' ) })); //bottom
      materialArray.push(new THREE.MeshBasicMaterial( { map: Loader.loadTexture( 'res/skyboxsun25deg/5.bmp' ) }));
      materialArray.push(new THREE.MeshBasicMaterial( { map: Loader.loadTexture( 'res/skyboxsun25deg/2.bmp' ) }));

      for (var i = 0; i < 6; i++)
        materialArray[i].side = THREE.BackSide;
      var skyboxMaterial = new THREE.MeshFaceMaterial( materialArray );

      var skyboxMesh  = new THREE.Mesh( 
          new THREE.BoxGeometry( 7777, 7777, 7777 ),
          skyboxMaterial );

      this.scene.add(skyboxMesh);

      var shaderMat = new THREE.ShaderMaterial(SHADERS['PerlinMntn']).clone();
      var tCliff  = new THREE.TextureLoader().load('project/res/rock_cliffs.jpg');
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

    update(frame) {
      super.update(frame);
      demo.nm.nodes.bloom.opacity = 0.1;

      if(!this.initialized && this.inputs.mntngeom.getValue()){
        console.log("mntn init ");
        this.delayedInit();
        this.initialized = true;
        console.log("mntn initialized");
      }
      if(!this.initialized){
        return;
      }


      //Temp hack to play with quad camera dynamics. Refactor incomming
      var maxSpeed = 160/ 3.6; //m/s
      var maxAccel = 90; // m/s^2  (Realistic for an aggressive quad. Should be between 2-12g

      var dragCoeff = maxAccel/(maxSpeed*maxSpeed);

      var accel = function(speed){return Math.max(maxAccel - (dragCoeff * speed * speed),0);};

      var camz = 950;
      var camx = 300;
      var x = Math.round(this.mntnWidth * (camx + 0.5*this.mntnSizeX)/ this.mntnSizeX);
      var y = Math.round(this.mntnHeight * (camz + 0.5*this.mntnSizeY) / this.mntnSizeY);


      var startX = camx;
      var startY = 750.0;//this.heightmap[y-1][x-1]+4;
      var startZ = camz;
      if(frame < 3453){ // still
        this.camera.position.x = startX;
        this.camera.position.y = startY;
        this.camera.position.z = startZ;
        this.camera.dx = 0;
        this.camera.dy = 0;
        this.camera.dz = 0;
        this.camera.rotation.x = 0.1;
      }else if(frame < 3463){ //up
        this.camera.dy += accel(this.camera.dy) / 60;
        this.camera.position.y += this.camera.dy / 60;
        this.camera.rotation.x = 0.1;
      }else if(frame < 3473) { //fly forward
        this.camera.dz -= accel(this.camera.dz) / 60;

        this.camera.position.y += this.camera.dy / 60;
        this.camera.position.z += this.camera.dz / 60;

        this.camera.rotation.x -= Math.PI/40;

      }else if(frame < 3650) { //fly forward
        this.camera.dy -= 9.8 / 60; //Let's fall down
        this.camera.position.y += this.camera.dy / 60;

        this.camera.dz -= accel(this.camera.dz) / 60;
        this.camera.position.z += this.camera.dz / 60;

        this.camera.rotation.x = -Math.PI/4 + 0.1;

      }else { //fly up again!
        this.camera.dy += accel(this.camera.dy) / 60;
        this.camera.position.y += this.camera.dy / 60;

        this.camera.dz -= accel(this.camera.dz) / 60;
        this.camera.position.z += this.camera.dz / 60;

        this.camera.rotation.x = -Math.PI/8 + 0.1;

      }
    }
  }

  global.mntn = mntn;
})(this);
