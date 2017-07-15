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

      var bestMaterial = new THREE.MeshPhysicalMaterial({ color: 0x000fff, shading: THREE.SmoothShading });

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
    }

    render(renderer){
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.shadowMap.renderReverseSided = false;
        super.render(renderer);
      }

    update(frame) {
      super.update(frame);
      this.floorCube.needsUpdate = true;

      this.spotLightInside.position.x = 0.3 * Math.sin( Math.PI *2 * BEAN/36) - 0.2;
      // debugger;
/*
      this.camera.position.x = 20 * Math.sin( frame / 100);
      this.camera.position.y = 20 * Math.abs(Math.sin( frame / 90));
      this.camera.position.z = 20 * Math.sin( frame / 60);
      this.camera.lookAt(new THREE.Vector3(0,0,0));


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
