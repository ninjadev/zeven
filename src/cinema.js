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

      this.cubeCamera = new THREE.CubeCamera(0.01, 100, 2048);
      this.cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
      this.scene.add(this.cubeCamera);

      this.floor = new THREE.Mesh(
          new THREE.PlaneGeometry(10, 10),
          new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 0.05,
            metalness: 0,
          }));
      this.scene.add(this.floor);
      this.floor.position.y = -2.19;
      this.floor.rotation.x = -2 * Math.PI / 4;
      //this.floor.position.z = 10 / 2 - 0.01;

      this.keys = {};
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
        color: 0x111111,
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
          new THREE.MeshBasicMaterial());
      this.screen.position.z = 0.01;
      this.scene.add(this.screen);
      this.screenBorder = new THREE.Mesh(
          new THREE.PlaneGeometry(16 / 3 + 0.11, 9 / 3 + 0.1),
          new THREE.MeshStandardMaterial({
            color: 0x222222
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

      const pianoMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,  
        envMap: this.cubeCamera.renderTarget.texture,
        roughness: 0.2,
        metalness: 0.01,
        roughnessMap: Loader.loadTexture('res/rock_cliffs.jpg'),
      });

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
            item.material = pianoMaterial;
            if(item.name == 'Keyboard_Cover') {
                item.rotation.z = -1.8;
                item.position.x = -40.5;
                item.position.y = 26;
            }
            console.log(item.name, item);
            if(item.name.slice(0, 9) == 'Black_Key') {
              item.material = blackKeyMaterial.clone(); 
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

      this.scene.add(this.piano);
      this.piano.position.x = -3.5;
      this.piano.position.y = -2.2;
      this.piano.position.z = 1;
      this.piano.rotation.y = 2.2;
      this.keygroup.position.copy(this.piano.position);
      this.keygroup.position.x = -3.3;
      this.keygroup.position.z = 1.1;
      this.keygroup.rotation.copy(this.piano.rotation);

      this.walls = new THREE.Mesh(
          new THREE.BoxGeometry(10, 5, 10),
          new THREE.MeshStandardMaterial({
            color: 0x222222,
            map: Loader.loadTexture('res/rock_cliffs.jpg'),
            side: THREE.BackSide,
          }));
      this.scene.add(this.walls);
      this.walls.position.z = 10 / 2 - 0.01;
      this.walls.position.y = 5 / 2 - 3 / 2 - 0.7;

      this.rectLight = new THREE.RectAreaLight( 0xffffff, 1, 16 / 3, 9 / 3);
      this.rectLight.color.setHex(0xede0a3);
      this.rectLight.position.set( 0, 0, 0.0001 );
      //this.scene.add(this.rectLight);
      //
      this.pointLight = new THREE.PointLight();
      this.pointLight.decay = 2;
      this.pointLight.physicallyCorrectLights = true;
      this.scene.add(this.pointLight);

      this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));

      this.topLight = new THREE.DirectionalLight();
      this.topLight.position.set(0, 10, -1);
      this.topLight.intensity = 1;
      this.backLight = new THREE.DirectionalLight();
      this.backLight.position.set(0, 0, -10);
      this.topLight.intensity = 0.5;
      this.scene.add(this.topLight);
      this.scene.add(this.backLight);
    }

    update(frame) {
      super.update(frame);
      this.rectLight.intensity = 2 * ( 0.8 + 0.2 * (frame % 2));
      this.pointLight.intensity = 2 * ( 0.8 + 0.2 * (frame % 2));
      demo.nm.nodes.bloom.opacity = .8;
      this.screen.material.map = this.inputs.image.getValue();
      this.screen.material.needsUpdate = true;
      let step = (frame - 376) / (513 - 376);
      this.camera.position.x = smoothstep(0, -1.1, step);
      this.camera.position.y = smoothstep(0, -0.6, step);
      this.camera.position.z = smoothstep(6.77, 12, step);

      step = (frame - 616) / (1096 - 616);
      this.camera.position.x = smoothstep(this.camera.position.x, -3.17, step);
      this.camera.position.y = smoothstep(this.camera.position.y, -1.59, step);
      this.camera.position.z = smoothstep(this.camera.position.z, 1.28, step);

      this.camera.fov = smoothstep(25, 75, step);
      this.camera.roll = smoothstep(0, 0.14, step);
      this.camera.updateProjectionMatrix();

      this.lookAt.x = smoothstep(this.camera.position.x, -3.24, step);
      this.lookAt.y = smoothstep(this.camera.position.y, -1.61, step);
      this.lookAt.z = smoothstep(0, 1.16, step);

      this.camera.lookAt(this.lookAt);

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
          key._noteRotationTarget = -.5;
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
      //this.piano.visible = false;
      //this.keygroup.visible = false;
      this.cubeCamera.position.copy(this.piano.position);
      this.cubeCamera.updateCubeMap(renderer, this.scene);
      //this.keygroup.visible = true;
      //this.piano.visible = true;
      super.render(renderer);
    }
  }

  global.cinema = cinema;
})(this);
