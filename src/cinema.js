(function(global) {
  class cinema extends NIN.THREENode {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput(),
        },
        inputs: {
          image: new NIN.TextureInput()
        }
      });

      this.camrand = new Random('cinemacamrand');
      this.shakeAmount = 1;

      this.camera.shakePosition = new THREE.Vector3(0, 0, 0);
      this.camera.shakeVelocity = new THREE.Vector3(0, 0, 0);
      this.camera.shakeAcceleration = new THREE.Vector3(0, 0, 0);
      this.camera.angularShakePosition = new THREE.Vector3(0, 0, 0);
      this.camera.angularShakeVelocity = new THREE.Vector3(0, 0, 0);
      this.camera.angularShakeAcceleration = new THREE.Vector3(0, 0, 0);

      this.cubeCamera = new THREE.CubeCamera(0.01, 100, 512);
      this.cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
      this.scene.add(this.cubeCamera);

      this.sheetMusic = new THREE.Mesh(
          new THREE.CubeGeometry(0.001, 0.297, 0.21),
          new THREE.MeshStandardMaterial({
            color: 0x373737,
            map: Loader.loadTexture('res/sheet-music.jpg'),
            roughness: 1,
            metalness: 0,
          }));

      this.floor = new THREE.Mesh(
          new THREE.PlaneGeometry(10, 10),
          new THREE.MeshStandardMaterial({
            color: 0x040404,
            roughness: 1,
            metalness: 0,
          }));
      this.floor.receiveShadow = true;
      //this.scene.add(this.floor);
      this.floor.position.y = -2.19;
      this.floor.rotation.x = -2 * Math.PI / 4;
      //this.floor.position.z = 10 / 2 - 0.01;

      this.keys = {};
      for(let i = 0; i < 88; i++) {
        this.keys['' + i] = new THREE.Mesh();
      }
      const whiteKeyGeometry = new THREE.BoxGeometry(0.02, 0.03, 0.30);
      const blackKeyGeometry = new THREE.BoxGeometry(0.01, 0.03, 0.25);
      const whiteKeyMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.9,
        metalness: 0,
        emissive: 0x397eef,
        emissiveIntensity: 0,
      });
      const blackKeyMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 0.8,
        metalness: 0,
        emissive: 0xff8f26,
        emissiveIntensity: 0,
      });
      this.keygroup = new THREE.Object3D();
      let whites = 0;
      for(let i = 0; i < 88; i++) {
        let white = true;
        switch(i % 12) {
        case 1:
        case 4:
        case 6:
        case 9:
        case 11:
          white = false;
        }
        whites += white;
        /*
        const key = this.keys[(21 + i) + ''] = new THREE.Mesh(
            white ? whiteKeyGeometry : blackKeyGeometry,
            white ? whiteKeyMaterial : blackKeyMaterial);
        key.position.x = 0.0205 * (whites - 49 / 2);
        if(!white) {
          key.position.y = 0.008;
          key.position.x += 0.0205 / 2;
        }
        key._noteOn = false;
        key._noteRotation = 0;
        this.keygroup.add(key);
        */
      }
      this.scene.add(this.keygroup);

      this.screen = new THREE.Mesh(
          new THREE.PlaneGeometry(16 / 3, 9 / 3),
          new THREE.MeshStandardMaterial({
            roughness: 1,
            metalness: 0,
            emissive: 0xffffff,
            emissiveIntensity: 0.5,
          }));
      this.screen.position.z = 0.01;
      this.scene.add(this.screen);
      this.screenBorder = new THREE.Mesh(
          new THREE.PlaneGeometry(16 / 3 + 0.11, 9 / 3 + 0.1),
          new THREE.MeshStandardMaterial({
            color: 0x111111
          }));
      this.scene.add(this.screenBorder);
      this.camera.position.z = 6.77;
      this.camera.fov = 25;
      this.camera.near = 0.01;
      this.camera.updateProjectionMatrix();
      this.lookAt = new THREE.Vector3(0, 0, 0);

      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      canvas.getContext('2d').fillRect(0, 0, 1, 1);
      const blackMap = new THREE.Texture(canvas);

      const pianoMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x111111,  
        envMap: this.cubeCamera.renderTarget.texture,
        roughness: 0.2,
        metalness: 0.01,
        roughnessMap: Loader.loadTexture('res/rock_cliffs.jpg'),
        clearCoat: 1,
        reflectivity: 1,
      });

      this.pianoWrapper = new THREE.Object3D();
      this.pianoWrapper.add(this.sheetMusic);
      this.pianoWrapper.add(this.piano);
      this.scene.add(this.pianoWrapper);
      this.sheetMusic.position.y = 0.745;
      this.sheetMusic.position.x = -0.1555;
      this.sheetMusic.rotation.z = -0.12;

      this.candle = new THREE.Mesh(
          new THREE.CylinderGeometry(0.008, 0.008, .1, 32),
          new THREE.MeshStandardMaterial({
            color: 0x333333,            
            roughness: 1,
            metalness: 0,
          }));

      this.wick = new THREE.Mesh(
          new THREE.CylinderGeometry(0.0008, 0.0008, .05, 32),
          new THREE.MeshStandardMaterial({
            color: 0x000000,            
            roughness: 1,
            metalness: 0,
            roughnessMap: Loader.loadTexture('res/rock_cliffs.jpg'),
          }));

      this.wick.castShadow = true;
      this.wick.receiveShadow = true;

      this.candle.position.set(-0.3, .65, -0.555);
      this.wick.position.set(-0.3, .682, -0.555);
      this.pianoWrapper.add(this.candle);
      this.pianoWrapper.add(this.wick);

      this.candleFlame = new THREE.Mesh(
          new THREE.BoxGeometry(0.009, 0.009, 0.009),
          new THREE.MeshStandardMaterial({
            color: 0x444444,
            metalness: 0.98,
            roughness: 0.4,
            emissive: 0xffbb1e,
            emissiveIntensity: 0.5,
          }));

      this.candleLight = new THREE.PointLight(0xffbb1e, 1, 2, 2);
      this.candleLight.physicallyCorrectLights = true;
      this.candleLight.castShadow = true;
      this.candleLight.intensity = 3;
      this.candleLight.shadow.mapSize.width = 512;
      this.candleLight.shadow.mapSize.height = 512;
      this.candleLight.shadow.camera.near = 0.01;
      this.candleLight.shadow.camera.far = 5;
      this.candleLight.shadow.bias = 0.01;

      this.pianoWrapper.add(this.candleFlame);
      this.candleFlame.position.set(-0.3, .72, -0.555);
      this.pianoWrapper.add(this.candleLight);
      this.candleLight.position.copy(this.candleFlame.position);

      this.piano = new THREE.Object3D();
      this.piano.scale.set(2, 2, 2);
      Loader.loadAjax('res/piano.obj', text => {
        const loader = new THREE.OBJLoader();
        const object = loader.parse(text);
        const scale = 0.01;
        object.scale.set(scale, scale, scale);
        this.piano.add(object);
        object.traverse(item => {
          if(item instanceof THREE.Mesh) {
            item.receiveShadow = true;
            item.castShadow = true;
            item.material = pianoMaterial;
            if(item.name == 'Keyboard_Cover') {
                item.rotation.z = -2;
                item.position.x = -38.4;
                item.position.y = 34;
            }
            if(item.name.slice(0, 9) == 'Black_Key') {
              item.material = blackKeyMaterial.clone(); 
              item.castShadow = false;
              item.isWhite = false;
              const blackKeyNumber = parseInt(item.name.slice(9), 10) || 0;
              let finalNumber = (blackKeyNumber / 5 | 0) * 12;
              switch(blackKeyNumber % 5) {
                case 0:
                  finalNumber += 1;
                  break;
                case 1:
                  finalNumber += 4;
                  break;
                case 2:
                  finalNumber += 6;
                  break;
                case 3:
                  finalNumber += 9;
                  break;
                case 4:
                  finalNumber += 11;
                  break;
              }
              finalNumber += 21;
              const key = this.keys[finalNumber] = item;
              key._noteOn = false;
              key._noteRotation = 0;
            }
            if(item.name.slice(0, 10) == 'White_Keys') {
              item.material = whiteKeyMaterial.clone();
              item.castShadow = false;
              item.isWhite = true;
              const whiteKeyNumber = parseInt(item.name.slice(10), 10);
              let finalNumber = (whiteKeyNumber / 8 | 0) * 12;
              switch(whiteKeyNumber % 7) {
              case 0:
                finalNumber += 0;
                break;
              case 1:
                finalNumber += 2;
                break;
              case 2:
                finalNumber += 3;
                break;
              case 3:
                finalNumber += 5;
                break;
              case 4:
                finalNumber += 7;
                break;
              case 5:
                finalNumber += 8;
                break;
              case 6:
                finalNumber += 10;
                break;
              }
              finalNumber += 21;
              const key = this.keys[finalNumber] = item;
              key._noteOn = false;
              key._noteRotation = 0;
            }
          }
        });
      });

      this.pianoWrapper.add(this.piano);
      this.pianoWrapper.position.x = -3.5;
      this.pianoWrapper.position.y = -2.2;
      this.pianoWrapper.position.z = 1;
      this.pianoWrapper.rotation.y = 2.2;
      this.keygroup.position.copy(this.piano.position);
      this.keygroup.position.x = -3.3;
      this.keygroup.position.z = 1.1;
      this.keygroup.rotation.copy(this.piano.rotation);


      this.walls = new THREE.Mesh(
          new THREE.BoxGeometry(10, 5, 10),
          new THREE.MeshStandardMaterial({
            color: 0x111111,
            map: Loader.loadTexture('res/woodwall.jpg'),
            side: THREE.BackSide,
            metalness: 0,
            roughness: 1,
          }));
      this.walls.material.map.wrapS = THREE.RepeatWrapping;
      this.walls.material.map.wrapT = THREE.RepeatWrapping;
      this.walls.material.map.repeat.set(32, 8);
      this.walls.receiveShadow = true;
      this.scene.add(this.walls);
      this.walls.position.z = 10 / 2 - 0.01;
      this.walls.position.y = 5 / 2 - 3 / 2 - 0.7;

      const previewNames = [
        'res/checkered-skybox.png', 
        'res/tunnel-preview.png', 
        'res/nn7preview.png', 
        'res/indianrose.jpg', 
        'res/rock_cliffs.jpg', 
        'res/gradient.jpg', 
      ];
      for(let i = 0; i < previewNames.length; i++) {
        const map = Loader.loadTexture(previewNames[i]);
        const painting = new THREE.Mesh(
            new THREE.BoxGeometry(0.001, 1 / 16, 1 / 9),
            new THREE.MeshStandardMaterial({
              color: 0x222222,
              map: map,
              roughnessMap: map,
              metalness: 0,
              roughness: 1.,
            }));
        /*
        painting.material.roughnessMap.wrapS = THREE.RepeatWrapping;
        painting.material.roughnessMap.wrapT = THREE.RepeatWrapping;
        painting.material.roughnessMap.repeat.set(100, 0.01);
        */
        painting.scale.set(4, 4, 4);
        painting.receiveShadow = true;
        this.scene.add(painting);
        painting.position.x = -5;
        painting.position.y = -1.3;
        painting.position.z = 1.5 + 0.5 * (i - 1);
      }

      this.pointLight = new THREE.PointLight();
      this.pointLight.decay = 2;
      this.pointLight.physicallyCorrectLights = true;
      this.scene.add(this.pointLight);

      this.scene.add(new THREE.AmbientLight(0xffffff, 0.3));

      this.topLight = new THREE.DirectionalLight();
      this.topLight.position.set(0, 10, -1);
      this.topLight.intensity = 0.1;
      this.backLight = new THREE.DirectionalLight();
      this.backLight.position.set(0, 0, -10);
      this.topLight.intensity = 0.1;
      this.scene.add(this.topLight);
      this.scene.add(this.backLight);
    }

    update(frame) {
      super.update(frame);

      this.candleFlame.rotation.x = frame / 33;
      this.candleFlame.rotation.y = frame / 42;
      this.candleFlame.rotation.z = frame / 52;

      this.candleLight.intensity = 3;
      this.pointLight.intensity = 2 * ( 0.8 + 0.2 * (frame % 2));
      this.pointLight.intensity *= 0.2;
      demo.nm.nodes.bloom.opacity = 1;
      this.screen.material.map = this.inputs.image.getValue();
      this.screen.material.emissiveMap = this.inputs.image.getValue();
      this.screen.material.needsUpdate = true;
      this.camera.fov = 25;
      if(frame < 650) {
        const step = (frame - 376) / (513 - 376) / 2;
        this.camera.position.x = smoothstep(0, -1.1, step);
        this.camera.position.y = smoothstep(0, -0.6, step);
        this.camera.position.z = smoothstep(6.77, 12, step);
        this.camera.rotation.set(0, 0, 0);
        this.shakeAmount = lerp(0, 0.001, step);
      } else if(frame < 796) {
        const step = (frame - 650) / (796 - 650) * 0.85;
        this.camera.position.x = lerp(-3.4047676675534095, -3.260913266141462, step);
        this.camera.position.y = lerp(-1.3492077211211249, -1.3411366515637337, step);
        this.camera.position.z = lerp(1.2864457553393909, 1.1898702376363435, step);
        this.camera.rotation.x = lerp(-0.08314122594572174, -0.08314122594572174, step);
        this.camera.rotation.y = lerp(0.5864066162783125, 0.5864066162783125, step);
        this.camera.rotation.z = lerp(0.22796222750506834, 0.22796222750506834, step);
        this.candleLight.intensity = 10;
        this.shakeAmount = 0.0001;
      /*
      } else {
      */
      } else if(frame < 908) {
        const step = (frame - 796) / (908 - 796) * 0.5 + 0.5;
        this.shakeAmount = 0.001;
        this.camera.position.set(
          -3.8095714737047874,
          -1.462809819298461,
          1.6090197635679977);
        this.camera.rotation.set(
          -0.4330234952074363,
          -0.7897668671987589,
          -0.30249985706435634);
        this.camera.position.x = lerp(
            -3.544228866161326,
            -3.317387384444265,
            step);
        this.camera.position.y = lerp(
          -0.28644798011495914,
          -1.2165389787123175,
          step);
        this.camera.position.z = lerp(
          1.8272527613614828,
          1.8531437812402505,
          step);
        this.camera.rotation.x = lerp(
          -1.1083632382889403,
          -0.591780967760112,
          step);
        this.camera.rotation.y = lerp(
          -0.10283863786060726,
          0.053408980585408126,
          step);
        this.camera.rotation.z = lerp(
          0.2807720208211995,
          0.29386947861137286,
          step);
      } else if(frame < 959) {
          const step = (frame - 908) / (959 - 908);
          demo.nm.nodes.bloom.opacity = 2.5;
          this.shakeAmount = 0.001;
          this.camera.position.x = lerp(
            -2.842442015988314,
            -3.0775859451207563,
            step);
          this.camera.position.y = lerp(
            -1.4931535644716758,
            -1.4921105187713266,
            step);
          this.camera.position.z = lerp(
            1.193582336169457,
            1.3614302479343925,
            step);
          this.camera.rotation.set(
            -0.620390331746024,
            0.5281023933190914,
            0.3414093145520857);
      } else {
        const step = (frame - 959) / (1233 - 959);
        this.camera.fov = easeIn(25, 10, step);
        this.shakeAmount = easeOut(0.001, 0, step);
        const qFrom = new THREE.Quaternion();
        qFrom.setFromEuler(new THREE.Euler(
          -1.9025241872116923,
          1.0939380478095968,
          1.8796259625716747));
        const qTo = new THREE.Quaternion();
        qTo.setFromEuler(new THREE.Euler(
          1.1722280429036072,
          1.4149343017072753,
          -1.1859792157277678));

        this.camera.position.x = easeIn( 
          -0.9507226747412427,
          -3.5848764172124543,
          step);
        this.camera.position.y = smoothstep(
          -0.5131095088905656 + .3,
          -1.5065816818784314,
          step) - easeIn(.3, 0, step);
        this.camera.position.z = lerp(
          0.7059477087019609 - 1.11,
          1.590458901038592,
          step) + easeIn(1.11, 0, step);
        THREE.Quaternion.slerp(qFrom, qTo, this.camera.quaternion, step);
        /*
        this.camera.rotation.x = lerp(
          -1.9025241872116923,
          1.1722280429036072,
          step);
        this.camera.rotation.y = easeIn(
          1.0939380478095968,
          1.4149343017072753,
          step);
        this.camera.rotation.z = easeIn(
          1.8796259625716747,
          -1.1859792157277678,
          step);
          */
      }
      this.camera.updateProjectionMatrix();

      this.camera.shakeAcceleration.set(
          -this.camera.shakePosition.x / 16 + (this.camrand() - 0.5) * this.shakeAmount,
          -this.camera.shakePosition.y / 16 + (this.camrand() - 0.5) * this.shakeAmount,
          -this.camera.shakePosition.z / 16 + (this.camrand() - 0.5) * this.shakeAmount);
      this.camera.shakeVelocity.add(this.camera.shakeAcceleration);
      this.camera.shakeVelocity.multiplyScalar(0.5);
      this.camera.shakePosition.add(this.camera.shakeVelocity);
      this.camera.position.add(this.camera.shakePosition);

      this.camera.angularShakeAcceleration.set(
          -this.camera.angularShakePosition.x / 16 + (this.camrand() - 0.5) * this.shakeAmount,
          -this.camera.angularShakePosition.y / 16 + (this.camrand() - 0.5) * this.shakeAmount,
          -this.camera.angularShakePosition.z / 16 + (this.camrand() - 0.5) * this.shakeAmount);
      this.camera.angularShakeVelocity.add(this.camera.angularShakeAcceleration);
      this.camera.angularShakeVelocity.multiplyScalar(0.5);
      this.camera.angularShakePosition.add(this.camera.angularShakeVelocity);
      this.camera.position.add(this.camera.angularShakePosition);



      const bar = 48;
      const beat = 12;
      switch(BEAN - bar) {
      case 2 * bar + 0:
        this.keys[76]._noteOn = true;
        this.keys[64]._noteOn = true;
        this.keys[60]._noteOn = true;
        this.keys[57]._noteOn = true;
        this.keys[55]._noteOn = true;
        this.keys[53]._noteOn = true;
        break;
      case 2 * bar + 9:
        this.keys[76]._noteOn = false;
        this.keys[69]._noteOn = true;
        break;
      case 2 * bar + 18:
        this.keys[69]._noteOn = false;
        this.keys[72]._noteOn = true;
        break;
      case 2 * bar + 3 * beat:
        this.keys[72]._noteOn = false;
        break;
      case 2 * bar + 3 * beat + 3:
        this.keys[74]._noteOn = true;
        break;
      case 2 * bar + 3 * beat + 6:
        this.keys[74]._noteOn = false;
        this.keys[76]._noteOn = true;
        break;
      case 2 * bar + 3 * beat + 9:
        this.keys[76]._noteOn = false;
        this.keys[79]._noteOn = true;
        break;
      case 3 * bar:
        this.keys[79]._noteOn = false;
        this.keys[64]._noteOn = false;
        this.keys[60]._noteOn = false;
        this.keys[57]._noteOn = false;
        this.keys[55]._noteOn = false;
        this.keys[53]._noteOn = false;
        this.keys[74]._noteOn = true;
        this.keys[64]._noteOn = true;
        this.keys[62]._noteOn = true;
        this.keys[57]._noteOn = true;
        this.keys[54]._noteOn = true;
        break;
      case 3 * bar + 9:
        this.keys[74]._noteOn = false;
        this.keys[76]._noteOn = true;
        break;
      case 3 * bar + 18:
        this.keys[76]._noteOn = false;
        this.keys[81]._noteOn = true;
        break;
      case 3 * bar + 3 * beat:
        this.keys[81]._noteOn = false;
        this.keys[64]._noteOn = false;
        this.keys[62]._noteOn = false;
        this.keys[57]._noteOn = false;
        this.keys[54]._noteOn = false;
        this.keys[65]._noteOn = true;
        this.keys[62]._noteOn = true;
        this.keys[60]._noteOn = true;
        this.keys[58]._noteOn = true;
        this.keys[57]._noteOn = true;
        break;
      case 4 * bar:
        this.keys[65]._noteOn = false;
        this.keys[62]._noteOn = false;
        this.keys[60]._noteOn = false;
        this.keys[58]._noteOn = false;
        this.keys[57]._noteOn = false;
        this.keys[76]._noteOn = true;
        this.keys[64]._noteOn = true;
        this.keys[62]._noteOn = true;
        this.keys[60]._noteOn = true;
        this.keys[59]._noteOn = true;
        this.keys[55]._noteOn = true;
        break;
      case 4 * bar + 9:
        this.keys[76]._noteOn = false;
        this.keys[69]._noteOn = true;
        break;
      case 4 * bar + 18:
        this.keys[69]._noteOn = false;
        this.keys[72]._noteOn = true;
        break;
      case 4 * bar + 3 * beat:
        this.keys[72]._noteOn = false;
        this.keys[64]._noteOn = false;
        this.keys[62]._noteOn = false;
        this.keys[60]._noteOn = false;
        this.keys[59]._noteOn = false;
        this.keys[55]._noteOn = false;
        break;
      case 4 * bar + 3 * beat + 3:
        this.keys[74]._noteOn = true;
        this.keys[62]._noteOn = true;
        this.keys[60]._noteOn = true;
        this.keys[56]._noteOn = true;
        this.keys[52]._noteOn = true;
        break;
      case 4 * bar + 3 * beat + 6:
        this.keys[74]._noteOn = false;
        this.keys[76]._noteOn = true;
        break;
      case 4 * bar + 3 * beat + 9:
        this.keys[76]._noteOn = false;
        this.keys[79]._noteOn = true;
        break;
      case 5 * bar:
        this.keys[79]._noteOn = false;
        this.keys[62]._noteOn = false;
        this.keys[60]._noteOn = false;
        this.keys[56]._noteOn = false;
        this.keys[52]._noteOn = false;
        this.keys[74]._noteOn = true;
        this.keys[71]._noteOn = true;
        this.keys[64]._noteOn = true;
        this.keys[60]._noteOn = true;
        this.keys[59]._noteOn = true;
        this.keys[57]._noteOn = true;
        break;
      case 5 * bar + 6:
        this.keys[74]._noteOn = false;
        this.keys[71]._noteOn = false;
        this.keys[72]._noteOn = true;
        break;
      case 5 * bar + 9:
        this.keys[76]._noteOn = true;
        break;
      case 5 * bar + 12:
        this.keys[72]._noteOn = false;
        break;
      case 5 * bar + 15:
        this.keys[76]._noteOn = false;
        this.keys[72]._noteOn = true;
        break;
      case 5 * bar + 17:
        this.keys[76]._noteOn = true;
        break;
      case 5 * bar + 18:
        this.keys[79]._noteOn = true;
        this.keys[81]._noteOn = true;
        break;
      case 5 * bar + 21:
        this.keys[72]._noteOn = false;
        break;
      case 5 * bar + 2 * beat:
        this.keys[64]._noteOn = false;
        this.keys[60]._noteOn = false;
        this.keys[59]._noteOn = false;
        this.keys[57]._noteOn = false;
        this.keys[62]._noteOn = true;
        this.keys[59]._noteOn = true;
        this.keys[57]._noteOn = true;
        this.keys[55]._noteOn = true;
        break;
      case 5 * bar + 2 * beat + 4:
        this.keys[76]._noteOn = false;
        break;
      case 5 * bar + 2 * beat + 5:
        this.keys[79]._noteOn = false;
        break;
      case 5 * bar + 2 * beat + 6:
        this.keys[81]._noteOn = false;
        this.keys[88]._noteOn = true;
        break;
      case 5 * bar + 2 * beat + 8:
        this.keys[88]._noteOn = false;
        this.keys[86]._noteOn = true;
        break;
      case 5 * bar + 2 * beat + 10:
        this.keys[86]._noteOn = false;
        this.keys[84]._noteOn = true;
        break;
      case 5 * bar + 3 * beat:
        this.keys[84]._noteOn = false;
        this.keys[81]._noteOn = true;
        break;
      case 5 * bar + 3 * beat + 2:
        this.keys[81]._noteOn = false;
        this.keys[79]._noteOn = true;
        break;
      case 5 * bar + 3 * beat + 4:
        this.keys[79]._noteOn = false;
        this.keys[76]._noteOn = true;
        break;
      case 5 * bar + 3 * beat + 6:
        this.keys[76]._noteOn = false;
        this.keys[74]._noteOn = true;
        break;
      case 5 * bar + 3 * beat + 8:
        this.keys[74]._noteOn = false;
        this.keys[72]._noteOn = true;
        break;
      case 5 * bar + 3 * beat + 10:
        this.keys[72]._noteOn = false;
        this.keys[69]._noteOn = true;
        break;
      case 6 * bar:
        this.keys[69]._noteOn = false;
        this.keys[62]._noteOn = false;
        this.keys[59]._noteOn = false;
        this.keys[57]._noteOn = false;
        this.keys[55]._noteOn = false;
        this.keys[76]._noteOn = true;
        this.keys[64]._noteOn = true;
        this.keys[60]._noteOn = true;
        this.keys[57]._noteOn = true;
        this.keys[55]._noteOn = true;
        this.keys[53]._noteOn = true;
        break;
      case 6 * bar + 2:
        this.keys[55]._noteOn = false;
        break;
      case 6 * bar + 3:
        this.keys[55]._noteOn = true;
        break;
      case 6 * bar + 5:
        this.keys[57]._noteOn = false;
        break;
      case 6 * bar + 6:
        this.keys[76]._noteOn = false;
        this.keys[57]._noteOn = true;
        break;
      case 6 * bar + 8:
        this.keys[60]._noteOn = false;
        break;
      case 6 * bar + 9:
        this.keys[60]._noteOn = true;
        this.keys[69]._noteOn = true;
        break;
      case 6 * bar + 14:
        this.keys[55]._noteOn = false;
        break;
      case 6 * bar + 15:
        this.keys[69]._noteOn = false;
        this.keys[55]._noteOn = true;
        break;
      case 6 * bar + 17:
        this.keys[57]._noteOn = false;
        break;
      case 6 * bar + 18:
        this.keys[72]._noteOn = true;
        this.keys[64]._noteOn = true;
        this.keys[57]._noteOn = true;
        break;
      case 6 * bar + 20:
        this.keys[60]._noteOn = false;
        break;
      case 6 * bar + 21:
        this.keys[60]._noteOn = true;
        break;
      case 6 * bar + 23:
        this.keys[55]._noteOn = false;
        this.keys[53]._noteOn = false;
        break;
      case 6 * bar + 2 * beat:
        this.keys[72]._noteOn = false;
        this.keys[64]._noteOn = false;
        this.keys[60]._noteOn = false;
        this.keys[57]._noteOn = false;
        this.keys[61]._noteOn = true;
        this.keys[57]._noteOn = true;
        this.keys[54]._noteOn = true;
        this.keys[52]._noteOn = true;
        this.keys[50]._noteOn = true;
        break;
      case 6 * bar + 2 * beat + 3:
        this.keys[69]._noteOn = true;
        break;
      case 6 * bar + 2 * beat + 6:
        this.keys[64]._noteOn = true;
        break;
      case 6 * bar + 2 * beat + 9:
        this.keys[69]._noteOn = false;
        this.keys[66]._noteOn = true;
        break;
      case 6 * bar + 3 * beat - 1:
        this.keys[66]._noteOn = false;
        break;
      case 6 * bar + 3 * beat:
        this.keys[71]._noteOn = true;
        this.keys[66]._noteOn = true;
        break;
      case 6 * bar + 3 * beat + 3:
        this.keys[52]._noteOn = false;
        break;
      case 6 * bar + 3 * beat + 6:
        this.keys[71]._noteOn = false;
        this.keys[69]._noteOn = true;
        break;
      case 6 * bar + 3 * beat + 7:
        this.keys[54]._noteOn = false;
        break;
      case 6 * bar + 3 * beat + 9:
        this.keys[71]._noteOn = true;
        this.keys[69]._noteOn = false;
        break;
      case 6 * bar + 3 * beat + 11:
        this.keys[66]._noteOn = false;
        this.keys[64]._noteOn = false;
        this.keys[61]._noteOn = false;
        this.keys[57]._noteOn = false;
        break;
      case 7 * bar:
        this.keys[50]._noteOn = false;
        this.keys[74]._noteOn = true;
        this.keys[66]._noteOn = true;
        this.keys[64]._noteOn = true;
        this.keys[59]._noteOn = true;
        this.keys[52]._noteOn = true;
        break;
      case 7 * bar + 1:
        this.keys[68]._noteOn = true;
        break;
      case 7 * bar + 2:
        this.keys[59]._noteOn = false;
        break;
      case 7 * bar + 3:
        this.keys[59]._noteOn = true;
        break;
      case 7 * bar + 5:
        this.keys[64]._noteOn = false;
        break;
      case 7 * bar + 6:
        this.keys[64]._noteOn = true;
        break;
      case 7 * bar + 8:
        this.keys[66]._noteOn = false;
        break;
      case 7 * bar + 9:
        this.keys[76]._noteOn = true;
        this.keys[66]._noteOn = true;
        break;
      case 7 * bar + 1 * beat:
        this.keys[71]._noteOn = false;
        break;
      case 7 * bar + 1 * beat + 2:
        this.keys[74]._noteOn = false;
        this.keys[59]._noteOn = false;
        break;
      case 7 * bar + 1 * beat + 3:
        this.keys[76]._noteOn = false;
        this.keys[59]._noteOn = true;
        break;
      case 7 * bar + 1 * beat + 5:
        this.keys[76]._noteOn = true;
        break;
      case 7 * bar + 1 * beat + 6:
        this.keys[88]._noteOn = true;
        this.keys[68]._noteOn = true;
        break;
      case 7 * bar + 1 * beat + 7:
        this.keys[76]._noteOn = false;
        break;
      case 7 * bar + 2 * beat + 9:
        this.keys[64]._noteOn = false;
        this.keys[59]._noteOn = false;
        break;
      case 7 * bar + 2 * beat + 10:
        this.keys[88]._noteOn = false;
        this.keys[68]._noteOn = false;
        this.keys[66]._noteOn = false;
        this.keys[66]._noteOn = false;
        break;
      case 7 * bar + 2 * beat + 11:
        this.keys[52]._noteOn = false;
        break;
      }

      for(let noteNumber in this.keys) {
        const key = this.keys[noteNumber];
        if(key._noteOn) {
          key._noteRotationTarget = key.isWhite ? -.5 : -0.3;
        } else {
          key._noteRotationTarget = 0;
        }
        /* yeah, its position now */
        key.position.y = lerp(key.position.y, key._noteRotationTarget,
            key._noteRotationTarget < key.position.y ? 0.8 : 0.3);
        key.material.emissiveIntensity = -key.position.y * 2.;
      }
    }

    render(renderer) {
      demo.nm.nodes.grading.gammaCorrection = true;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      this.piano.visible = false;
      this.keygroup.visible = false;
      this.cubeCamera.position.copy(this.piano.position);
      this.cubeCamera.updateCubeMap(renderer, this.scene);
      this.keygroup.visible = true;
      this.piano.visible = true;
      const now = performance.now();
      super.render(renderer);
    }
  }

  global.cinema = cinema;
})(this);
