(function(global) {
  class tunnel extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.camera.fov = 25;
      this.camera.updateProjectionMatrix();

      this.throbbies = [];
      for(let i = 0; i < 32; i++) {
        this.throbbies[i] = [];
        for(let j = 0; j < 256; j++) {
          this.throbbies[i][j] = 0;
        }
      }

      const circumference = 32;
      const radius = circumference / 2 / Math.PI;
      var geometry = new THREE.CylinderGeometry(
          radius,
          radius,
          512,
          circumference,
          512);

      for(let i = 0; i < geometry.vertices.length - circumference - 1; i+=2) {
        const vertex = geometry.vertices[i];
        const vertex2 = geometry.vertices[i + 1];
        const vertex3 = geometry.vertices[i + circumference];
        const vertex4 = geometry.vertices[i + circumference + 1];
        const displacement = 2 * Math.random();
        vertex.z += displacement * Math.cos(i / circumference * Math.PI * 2);
        vertex.x += displacement * Math.sin(i / circumference * Math.PI * 2);
        vertex2.z += displacement * Math.cos((i + 1) / circumference * Math.PI * 2);
        vertex2.x += displacement * Math.sin((i + 1) / circumference * Math.PI * 2);
        vertex3.z += displacement * Math.cos((i + circumference) / circumference * Math.PI * 2);
        vertex3.x += displacement * Math.sin((i + circumference) / circumference * Math.PI * 2);
        vertex4.z += displacement * Math.cos((i + circumference + 1) / circumference * Math.PI * 2);
        vertex4.x += displacement * Math.sin((i + circumference + 1) / circumference * Math.PI * 2);
      }

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.canvasTexture = new THREE.Texture(this.canvas);

      this.item = new THREE.Mesh(
          new THREE.CubeGeometry(radius / 3, radius / 3, radius / 3),
          new THREE.MeshStandardMaterial({
            color: 0xffd530 
          }));

      this.scene.add(this.item);

      var material = new THREE.MeshStandardMaterial({
        color: 0x19478e,
        side: THREE.BackSide,
        emissiveMap: this.canvasTexture,
        emissive: 0xffffff,
        emissiveIntensity: 0.1,
      });
      this.cylinder = new THREE.Mesh( geometry, material );
      this.scene.add(this.cylinder);

      var light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(50, 50, 50);
      this.light = light;
      this.scene.add(light);

      this.camera.position.z = 50;

      this.throb = 0;
      this.resize();
      this.drawCanvas();
    }

    resize() {
      this.canvas.width = 1024;
      this.canvas.height = 4096 * 2;
      super.resize();
    }

    drawCanvas() {
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.strokeStyle = 'white';
      this.ctx.fillStyle = 'white';
      this.ctx.lineWidth = 1;
      this.ctx.globalCompositeOperation = 'lighter';
      for(let i = 0; i < 32; i++) {
        for(let j = 0; j < 256; j++) {
          this.ctx.strokeRect(
              i / 32 * this.canvas.width,
              j / 256 * this.canvas.height,
              this.canvas.width / 32,
              this.canvas.height / 256);
          if(this.throbbies[i][j] > 1 / 256) {
            this.ctx.globalAlpha = this.throbbies[i][j];
            this.ctx.fillRect(
                i / 32 * this.canvas.width,
                j / 256 * this.canvas.height,
                this.canvas.width / 32,
                this.canvas.height / 256);
            this.ctx.globalAlpha = 1;
          }
        }
      }
      this.canvasTexture.needsUpdate = true;
    }

    update(frame) {
      super.update(frame);

      this.throb *= 0.95;

      for(let i = 0; i < 32; i++) {
        for(let j = 0; j < 256; j++) {
          this.throbbies[i][j] *= 0.9;
        }
      }

      if(BEAT) {
        switch((BEAN - 48) % 96) {
          case 0:
          case 9:
          case 18:
          case 27:
          case 36:
          case 42:
          case 48:
          case 57:
          case 66:
          case 84:
          this.throb = 1;
          for(let i = 0; i < 32; i++) {
            let a = Math.random() * 256 | 0;
            for(let j = 0; j < 32; j++) {
              this.throbbies[j][a] = 1;
            }
          }
        }
      }
      this.cylinder.material.emissiveIntensity = Math.max(this.throb, 0.5);

      this.cylinder.rotation.x = Math.PI / 2;
      this.camera.position.z = easeOut(250, -120, ((frame - 1233) / 60 / 60 * 105) % 4) - (frame - 1233) / 10;
      this.camera.fov = easeOut(85, 25, ((frame - 1233) / 60 / 60 * 105) % 4);
      demo.nm.nodes.bloom.opacity = easeOut(2.5, 1.5, ((frame - 1233) / 60 / 60 * 105) % 4);
      this.camera.updateProjectionMatrix();
      this.camera.position.x = 4 * Math.sin(frame / 100);
      this.camera.position.y = 4 * Math.cos(frame / 100);

      this.item.position.z = this.camera.position.z - 20;
      this.item.position.x = 0;
      this.item.position.y = 0;

      this.camera.lookAt(this.item.position);

      this.item.rotation.x = frame / 33;
      this.item.rotation.y = frame / 42;
      this.item.rotation.z = frame / 52;

      const scale = 0.5 + this.throb;
      this.item.scale.set(scale, scale, scale);

      this.light.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
    }

    render(renderer) {
      this.drawCanvas();
      super.render(renderer);
    }
  }

  global.tunnel = tunnel;
})(this);
