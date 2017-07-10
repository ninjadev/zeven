(function(global) {
  class mntn extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        },
        inputs: {
          mntnmesh: new NIN.Input()
        }
      });
      //TODO: get from input
      this.mntnWidth = 512;
      this.mntnHeight = 512;
      this.mntnSizeX = 2000;
      this.mntnSizeY = 2000;

      this.initialized = false;
    }

    delayedInit() {

      this.mntn = this.inputs.mntnmesh.getValue();
      console.log(this.mntn);

      this.mntn.castShadow = true;
      this.mntn.receiveShadow = true;

      this.mntn.rotation.x = -3.1415/2.0;
      this.scene.add(this.mntn);


      var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.9 );
      directionalLight.position.z = 2;
      directionalLight.position.x = 2;
      directionalLight.castShadow = true;
      this.scene.add( directionalLight );

      var light = new THREE.PointLight(0xffffff, 1, 10000);
      light.position.set(5, 1, 10);
      //this.scene.add(light);

      //GoPro HERO5  FOV :)
      this.camera = new THREE.PerspectiveCamera(118.2, 16/9, 1, 50000);

      this.camera.position.x = 0;
      this.camera.position.y = -70;
      this.camera.position.z = 90;
      this.camera.rotation.x = -3.14/8;
    }

    update(frame) {
      super.update(frame);

      if(!this.initialized && this.inputs.mntnmesh.getValue()){
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
