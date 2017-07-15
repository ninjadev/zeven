(function(global) {
  class spinningCube extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });


      this.lampModel = new THREE.Object3D();
      this.otherLamp = new THREE.Object3D();

      this.throb = 0;
      var loadObject = function (objPath, material, three_object) {
        var objLoader = new THREE.OBJLoader();
        Loader.loadAjax(objPath, function(text) {
          var object = objLoader.parse(text);
          object.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
              child.material = material;
              child.material.side = THREE.DoubleSide;
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          three_object.add(object);
        });
      };

      var bestMaterial = new THREE.MeshPhysicalMaterial({ color: 0x1d2026, shading: THREE.SmoothShading });

      loadObject('res/lamp/nin.obj', bestMaterial, this.lampModel );
      this.scene.add( this.lampModel );


      // loadObject('res/lamp/nin.obj', bestMaterial, this.otherLamp );
      // this.scene.add( this.otherLamp );
      // this.otherLamp.position.set(-2,0,-0.5)


      var floorMat = new THREE.MeshStandardMaterial( {
          roughness: 0.8,
          color: 0xffffff,
          metalness: 0.2,
          bumpScale: 0.0005
        });
      var floorCubeGeometry = new THREE.BoxGeometry(200,1,200);
      var floorGeometry = new THREE.PlaneBufferGeometry( 20, 20 );
      this.floorCube = new THREE.Mesh(
        floorCubeGeometry,
        floorMat
      );
      this.floorCube.receiveShadow = true;
      this.floorCube.position.set(0,-2,0);
      this.scene.add(this.floorCube);


      // this.anotherLight illuminates the lamp from the outside to make it
      // easier to see and work with the scene. Might be disabled in the final
      // shipment? (Make it positive in the z axis to illuminate the camera facing side.)
      // this.anotherLight = new THREE.PointLight(0xffffff, 1, 5, 2);
      // this.anotherLight.position.set(-0.5,0.2,0.5);
      // this.anotherLight.physicallyCorrectLights = true;
      // this.anotherLight.castShadow = true;
      // var pointLightHelper = new THREE.PointLightHelper(this.anotherLight, 2);
      // this.scene.add(this.anotherLight);

      // this.spotlightOverheadForAmbientLight = new THREE.SpotLight( 0xfefefe );
      // this.spotlightOverheadForAmbientLight.castShadow = false;
      // this.spotlightOverheadForAmbientLight.position.set(5,5,0);
      // this.spotlightOverheadForAmbientLight.target = this.floorCube;
      // this.scene.add(this.spotlightOverheadForAmbientLight);

      // The light that casts shadow.
      this.spotLightInside = new THREE.SpotLight( 0xFF8A17 ); // Spicy mustard
      this.spotLightInside.add(
        new THREE.Mesh(
          new THREE.SphereGeometry(0.1,0.1,0.1),
          new THREE.MeshBasicMaterial({color: 0xffffff})
        )
      );
      this.spotLightInside.castShadow = true;
      this.spotLightInside.position.set(0,0.79,0);
      this.spotLightInside.shadow.mapSize.width = 1024;
      this.spotLightInside.shadow.mapSize.height = 1024;
      this.spotLightInside.target = this.floorCube;
      this.scene.add(this.spotLightInside);


      // this.firstColoredSpotlight = new THREE.SpotLight( 0xFFCC4C ); // faded yellow tinted designer white
      // this.firstColoredSpotlight.castShadow = true;
      // this.firstColoredSpotlight.position.set(0,0.3,0);
      // this.firstColoredSpotlight.shadow.mapSize.width = 1024;
      // this.firstColoredSpotlight.shadow.mapSize.height = 1024;
      // this.firstColoredSpotlight.target = this.floorCube;
      // this.scene.add(this.firstColoredSpotlight);

      // this.secondColoredSpotlight = new THREE.SpotLight( 0x0294FF ); // Pale bluberry
      // this.secondColoredSpotlight.castShadow = true;
      // this.secondColoredSpotlight.position.set(0.5,0.5,-0.2);
      // this.secondColoredSpotlight.shadow.mapSize.width = 1024;
      // this.secondColoredSpotlight.shadow.mapSize.height = 1024;
      // this.secondColoredSpotlight.target = this.floorCube;
      // this.scene.add(this.secondColoredSpotlight);

      // this.camera.position.set(10.4,20.58,-11.65);
      this.camera.position.set(3.64,5.95,-3.99);
      this.camera.lookAt(new THREE.Vector3(0.86,-1.5,-0.4));

      // this.lampModel.rotation.x = Math.cos(frame / 20);
      // Math.PI/5 ~ 0.628
      // this.spotLightInside.position.x = 0.9 * Math.sin(1024/50);
      // this.spotLightInside.position.y = 0.628 * Math.abs(Math.cos(1024/50)) + 0.25;
      // this.spotLightInside.position.z = 0.628 * Math.cos(1024/50);

      // this.firstColoredSpotlight.position.x = 0.9 * Math.cos(1024/66) + 0.5;
      // this.firstColoredSpotlight.position.y = 0.628 * Math.abs(Math.sin(1024/66)) + 0.25;
      // this.firstColoredSpotlight.position.z = 0.628 * Math.cos(1024/66);

      // this.secondColoredSpotlight.position.x = 0.9 * Math.cos(1024/59) - 0.5;
      // this.secondColoredSpotlight.position.y = 0.628 * Math.abs(Math.sin(1024/59)) + 0.25;
      // this.secondColoredSpotlight.position.z = 0.628 * Math.cos(1024/59) + 0.5;
      // this.cube.rotation.x = Math.sin(frame / 10);
      // this.cube.rotation.y = Math.cos(frame / 10);
      this.sidewayPosition = new THREE.Vector3(1.96,-0.56,-2.18);
      this.sidewayView = new THREE.Vector3(0.65,-1.5,-1.32);
      this.upwardPosition = new THREE.Vector3(-4.66, -0.5, 3.25);
      this.upwardView = new THREE.Vector3(4.35, 0.14, 0);
      this.lampyInitCameraPosition = {
        "firstFrame": 5620,
        "lastFrame": 5800,
        "lastBean": 2028,
        "cameraLocation": new THREE.Vector3(-2.16,-0.37,-0.84),
        "cameraLookAtPoint": new THREE.Vector3(0.38,0.16,-0.28)
      };
      this.lampyLookingDownCameraPosition = {
        "firstFrame": 5800,
        "lastFrame": 0,
        "cameraLocation": new THREE.Vector3(3.64,5.95,-3.99),
        "cameraLookAtPoint": new THREE.Vector3(0.86,-1.5,-0.4)
      }
      var xDistance = this.lampyLookingDownCameraPosition.cameraLocation.x - this.lampyLookingDownCameraPosition.cameraLookAtPoint.x;
      var yDistance = this.lampyLookingDownCameraPosition.cameraLocation.x - this.lampyLookingDownCameraPosition.cameraLookAtPoint.x;
      var zDistance = this.lampyLookingDownCameraPosition.cameraLocation.x - this.lampyLookingDownCameraPosition.cameraLookAtPoint.x;
      var lookingDownRadius = Math.sqrt(
        (xDistance*xDistance) + (yDistance * yDistance) + (zDistance *zDistance)
      );

      this.lampyLookingDownCameraPosition.radius = lookingDownRadius;

      this.lampyLookingDownCameraPosition.height = this.lampyLookingDownCameraPosition.cameraLocation.y - this.lampyLookingDownCameraPosition.cameraLookAtPoint.y;

      this.lampyLookingDownCameraPosition.yRadius = Math.sqrt((this.lampyLookingDownCameraPosition.radius * this.lampyLookingDownCameraPosition.radius) - (this.lampyLookingDownCameraPosition.height * this.lampyLookingDownCameraPosition.height));
    }

    render(renderer){
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.shadowMap.renderReverseSided = false;
        super.render(renderer);
      }

    update(frame) {
      if(frame > 6660){
        
        return;
      }
      super.update(frame);
      this.floorCube.needsUpdate = true;
      this.throb *= 0.94;
        if(BEAT && BEAN % 24 == 12) {
          this.throb = 1;
      }
      demo.nm.nodes.bloom.opacity =  this.throb * 0.5;
      this.spotLightInside.position.x = 0.3 * Math.sin( Math.PI *2 * BEAN/36) - 0.2;

      if(BEAN < this.lampyInitCameraPosition.lastBean){
        // debugger;
        this.camera.position.x = this.lampyInitCameraPosition.cameraLocation.x;
        this.camera.position.y = this.lampyInitCameraPosition.cameraLocation.y;
        this.camera.position.z = this.lampyInitCameraPosition.cameraLocation.z;
        this.camera.lookAt(this.lampyInitCameraPosition.cameraLookAtPoint);
      }
      else if(BEAN < this.lampyInitCameraPosition.lastBean + 48){
        var progression = (BEAN - this.lampyInitCameraPosition.lastBean)/(48);

        // Give camera new position
        this.camera.position.x = smoothstep(this.lampyInitCameraPosition.cameraLocation.x, this.lampyLookingDownCameraPosition.cameraLocation.x, progression);
        this.camera.position.y = smoothstep(this.lampyInitCameraPosition.cameraLocation.y, this.lampyLookingDownCameraPosition.cameraLocation.y, progression);
        this.camera.position.z = smoothstep(this.lampyInitCameraPosition.cameraLocation.z, this.lampyLookingDownCameraPosition.cameraLocation.z, progression);

        // Fix camera orientation:
        var ProgressiveCameraTarget = new THREE.Vector3(
          smoothstep(this.lampyInitCameraPosition.cameraLookAtPoint.x, this.lampyLookingDownCameraPosition.cameraLookAtPoint.x, progression),
          smoothstep(this.lampyInitCameraPosition.cameraLookAtPoint.y, this.lampyLookingDownCameraPosition.cameraLookAtPoint.y, progression),
          smoothstep(this.lampyInitCameraPosition.cameraLookAtPoint.z, this.lampyLookingDownCameraPosition.cameraLookAtPoint.z, progression),
          );
        this.camera.lookAt(ProgressiveCameraTarget);

      }
      else if (BEAN > 2160 && BEAN < 2208){
        this.camera.position.x = this.sidewayPosition.x;
        this.camera.position.y = this.sidewayPosition.y;
        this.camera.position.z = this.sidewayPosition.z;
        this.camera.lookAt(this.sidewayView);
      }
      else if (BEAN >2208 && BEAN <2256){
        this.lampModel.rotation.y = Math.sin(frame/(20*((BEAN % 2205))));

      }
      else if (BEAN > 2304 && BEAN <2312){

        this.camera.position.x = this.upwardPosition.x;
        this.camera.position.y = this.upwardPosition.y;
        this.camera.position.z = this.upwardPosition.z;
        this.camera.lookAt(this.upwardView);

      }

      else if (BEAN > 2312 && BEAN < 2324){

        this.camera.position.x = this.sidewayPosition.x;
        this.camera.position.y = this.sidewayPosition.y;
        this.camera.position.z = this.sidewayPosition.z;
        this.camera.lookAt(this.sidewayView);

      }
      else{
        // Final position, should do some panning or some stuff at this point
        this.camera.position.x = this.lampyLookingDownCameraPosition.cameraLocation.x;
        this.camera.position.y = this.lampyLookingDownCameraPosition.cameraLocation.y;
        this.camera.position.z = this.lampyLookingDownCameraPosition.cameraLocation.z;

        // Always look at center point while we're circling:
        this.camera.lookAt(this.lampyLookingDownCameraPosition.cameraLookAtPoint);
      }
      // debugger;
/*
      this.camera.position.x = 20 * Math.sin( frame / 100);
      this.camera.position.y = 20 * Math.abs(Math.sin( frame / 90));
      this.camera.position.z = 20 * Math.sin( frame / 60);
      this.camera.lookAt(new THREE.Vector3(0.86,-1.5,-0.4));
      //this.camera.lookAt(new THREE.Vector3(0,0,0));

/*
      // this.lampModel.rotation.x = Math.cos(frame / 20);
      // Math.PI/5 ~ 0.628
      this.spotLightInside.position.x = 0.9 * Math.sin(frame/50);
      this.spotLightInside.position.y = 0.628 * Math.abs(Math.cos(frame/50)) + 0.25;
      this.spotLightInside.position.z = 0.628 * Math.cos(frame/50);

      this.firstColoredSpotlight.position.x = 0.9 * Math.cos(frame/66) + 0.5;
      this.firstColoredSpotlight.position.y = 0.628 * Math.abs(Math.sin(frame/66)) + 0.25;
      this.firstColoredSpotlight.position.z = 0.628 * Math.cos(frame/66);

      this.secondColoredSpotlight.position.x = 0.9 * Math.cos(frame/59) - 0.5;
      this.secondColoredSpotlight.position.y = 0.628 * Math.abs(Math.sin(frame/59)) + 0.25;
      this.secondColoredSpotlight.position.z = 0.628 * Math.cos(frame/59) + 0.5;
      // this.cube.rotation.x = Math.sin(frame / 10);
      // this.cube.rotation.y = Math.cos(frame / 10);
*/
    }
  }

  global.spinningCube = spinningCube;
})(this);
