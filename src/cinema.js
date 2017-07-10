(function(global) {
  class cinema extends NIN.THREENode {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        },
        inputs: {
          image: new NIN.TextureInput()
        }
      });

      this.keys = {};
      const whiteKeyGeometry = new THREE.BoxGeometry(0.02, 0.03, 0.30);
      const blackKeyGeometry = new THREE.BoxGeometry(0.01, 0.03, 0.25);
      const whiteKeyMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
      });
      const blackKeyMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
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
      }
      this.scene.add(this.keygroup);

      this.screen = new THREE.Mesh(
          new THREE.PlaneGeometry(16 / 3, 9 / 3),
          new THREE.MeshBasicMaterial({
            map: this.inputs.image.getValue(),
          }));
      this.screen.position.z = 0.01;
      this.scene.add(this.screen);
      this.screenBorder = new THREE.Mesh(
          new THREE.PlaneGeometry(16 / 3 + 0.11, 9 / 3 + 0.1),
          new THREE.MeshStandardMaterial({
            color: 0xffffff
          }));
      this.scene.add(this.screenBorder);
      this.camera.position.z = 6.77;
      this.camera.fov = 25;
      this.camera.updateProjectionMatrix();
      this.lookAt = new THREE.Vector3(0, 0, 0);

      this.piano = new THREE.Mesh(
          new THREE.BoxGeometry(1.5, 1.1, 0.6),
          new THREE.MeshStandardMaterial({
            color: 0xffffff,  
          }));
      this.scene.add(this.piano);
      this.piano.position.x = -3.5;
      this.piano.position.y = -1.5 + 1.1 / 2 - 0.7;
      this.piano.position.z = 1;
      this.piano.rotation.y = 1.2;
      this.keygroup.position.copy(this.piano.position);
      this.keygroup.position.x = -3.3;
      this.keygroup.position.z = 1.1;
      this.keygroup.rotation.copy(this.piano.rotation);

      this.walls = new THREE.Mesh(
          new THREE.BoxGeometry(10, 5, 10),
          new THREE.MeshStandardMaterial({
            color: 0x666666,
            side: THREE.BackSide,
          }));
      this.scene.add(this.walls);
      this.walls.position.z = 10 / 2 - 0.001;
      this.walls.position.y = 5 / 2 - 3 / 2 - 0.7;

      this.rectLight = new THREE.RectAreaLight( 0xffffff, 1, 16 / 3, 9 / 3);
      this.rectLight.color.setHex(0xede0a3);
      this.rectLight.position.set( 0, 0, 0.0001 );
      this.scene.add(this.rectLight);

      this.scene.add(new THREE.AmbientLight(0xffffff, 0.05));

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
      demo.nm.nodes.add.opacity = .8;
      this.screen.material.map = this.inputs.image.getValue();
      let step = (frame - 376) / (513 - 376);
      this.camera.position.x = smoothstep(0, -1.1, step);
      this.camera.position.y = smoothstep(0, -0.6, step);
      this.camera.position.z = smoothstep(6.77, 12, step);

      step = (frame - 616) / (822 - 616);
      this.camera.position.x = smoothstep(this.camera.position.x, -1.5, step);
      this.camera.position.y = smoothstep(this.camera.position.y, -1.2, step);
      this.camera.position.z = smoothstep(this.camera.position.z, 2, step);

      this.lookAt.x = smoothstep(this.camera.position.x, -5.5, step);
      this.lookAt.y = smoothstep(this.camera.position.y, -1.8, step);
      this.lookAt.z = 0;

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
          key._noteRotationTarget = 0.05;
        } else {
          key._noteRotationTarget = 0;
        }
        key.rotation.x = lerp(key.rotation.x, key._noteRotationTarget,
            key._noteRotationTarget > key.rotation.x ? 0.8 : 0.3);
      }
    }
  }

  global.cinema = cinema;
})(this);
