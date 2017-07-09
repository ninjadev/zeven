(function(global) {
  class mntn extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      console.log("Mountain time!");

      //Support for different resolution on heightmap than mesh
      this.mntnWidth = 512;
      this.mntnHeight = 512;
      var meshWidth = 256;
      var widthFactor = this.mntnWidth / meshWidth;
      var meshHeight = 256;
      var heightFactor = this.mntnHeight / meshHeight;

      var startFreq = 1.0/512.0;
      var persistence = 0.42;
      var startAmpl = 1300.0;
      var noiseLevels = 8;

      console.log("Generate height map");
      /////////////
      // Generate height map for the mountains
      ////////////

      var noise = NIN.ImprovedNoise().noise;

      this.heightmap = new Array(this.mntnWidth);
      for(var x = 0; x < this.mntnWidth; x++ ){
        this.heightmap[x] = new Array(this.mntnHeight);
        for(var y = 0; y < this.mntnHeight; y++ ){
          var h = 0;
          var ampl = startAmpl;
          var freq = startFreq;
          for(var i = 0; i < noiseLevels; i++){
            h += ampl * noise(x * freq , y * freq ,0);
            freq *= 2;
            ampl *= persistence;
          }
          this.heightmap[x][y] = 1000.0 - Math.abs(h);
        }
      }

      console.log("Elevate geometry ");
      /////////////////
      // Elevate the geometry
      ////////////////
      this.mntnSizeX = 2000;
      this.mntnSizeY = 2000;
      var mntnGeom = new THREE.PlaneGeometry(this.mntnSizeX, this.mntnSizeY, meshWidth-1, meshHeight-1);
      for(var x = 0; x < meshWidth; x++ ){
        for(var y = 0; y < meshHeight; y++ ){
          mntnGeom.vertices[x*meshWidth+y].z 
            = this.heightmap[x*widthFactor][y*heightFactor];
        }
      }

      mntnGeom.computeFaceNormals();
      mntnGeom.computeVertexNormals();
      mntnGeom.normalsNeedUpdate = true;

      var shaderMat = new THREE.ShaderMaterial(SHADERS["PerlinMntn"]).clone();
      var tCliff  = new THREE.TextureLoader().load("project/res/rock_cliffs.jpg");
      tCliff.wrapS = THREE.RepeatWrapping;
      tCliff.wrapT = THREE.RepeatWrapping;

      shaderMat.uniforms.tCliff.value = tCliff;

      this.mntn = new THREE.Mesh( mntnGeom,
         // material);
          //new THREE.MeshPhongMaterial({ map:mapTexture}));
          //new THREE.MeshPhongMaterial({ wireframe:true}));
         // new THREE.MeshNormalMaterial());
       shaderMat);

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
      //Temp hack to play with quad camera dynamics. Refactor incomming
      var maxSpeed = 160/ 3.6; //m/s
      var maxAccel = 90; // m/s^2  (Realistic for an aggressive quad. Should be between 2-12g

      var dragCoeff = maxAccel/(maxSpeed*maxSpeed);

      var accel = function(speed){return Math.max(maxAccel - (dragCoeff * speed * speed),0);}

      var camz = 950;
      var camx = 300;
      var x = Math.round(this.mntnWidth * (camx + 0.5*this.mntnSizeX)/ this.mntnSizeX);
      var y = Math.round(this.mntnHeight * (camz + 0.5*this.mntnSizeY) / this.mntnSizeY);


      var startX = camx;
      var startY = this.heightmap[y-1][x-1]+4;
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
