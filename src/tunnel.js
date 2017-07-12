(function(global) {
  class tunnel extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      const circumference = 32;
      const radius = circumference / 2 / Math.PI;
      var geometry = new THREE.CylinderGeometry(
          radius,
          radius,
          512,
          circumference,
          512);

      this.random = new Random('tnmlpf');

      this.pointLight = new THREE.PointLight(0xffbb1e, 1, 0, 2);
      this.pointLight.physicallyCorrectLights = true;
      this.scene.add(this.pointLight);

      this.numberOfParticles = 0;
      this.particles = []
      this.particleMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
      });
      this.particleGeometry = new THREE.SphereGeometry(0.3, 8, 6);
      for(var i = 0; i < this.numberOfParticles; i++) {
        const particle = new THREE.Mesh(this.particleGeometry, this.particleMaterial);
        particle.position.x = (this.random() - 0.5) * radius * 2;
        particle.position.y = (this.random() - 0.5) * radius * 2;
        particle.position.z = (this.random() - 0.5) * 512;
        particle.scale.set(0.1, 0.1, 0.1);
        this.particles.push(particle);
        this.scene.add(particle);
      }

      this.camera.fov = 25;
      this.camera.updateProjectionMatrix();

      this.throbbies = [];
      for(let i = 0; i < 32; i++) {
        this.throbbies[i] = [];
        for(let j = 0; j < 256; j++) {
          this.throbbies[i][j] = 0;
        }
      }

      this.lookAt = new THREE.Vector3();

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
      this.canvasTexture.wrapS = THREE.RepeatWrapping;
      this.canvasTexture.wrapT = THREE.RepeatWrapping;
      this.canvasTexture.repeat.set(1, 8);

      this.cubeCamera = new THREE.CubeCamera(0.01, 100, 2048);
      this.cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
      this.scene.add(this.cubeCamera);

      this.item = new THREE.Mesh(
          new THREE.CubeGeometry(radius / 2, radius / 2, radius / 2),
          new THREE.MeshStandardMaterial({
            color: 0x444444,
            envMap: this.cubeCamera.renderTarget.texture,
            metalness: 0.98,
            roughness: 0.4,
            emissive: 0xffbb1e,
            emissiveIntensity: 0,
          }));

      this.scene.add(this.item);

      var material = new THREE.MeshStandardMaterial({
        color: 0x222222,
        side: THREE.BackSide,
        emissiveMap: this.canvasTexture,
        emissive: 0xffffff,
        emissiveIntensity: 0.1,
        rougness: 0.8,
      });
      this.cylinder = new THREE.Mesh( geometry, material );
      this.scene.add(this.cylinder);
      //this.cylinder.scale.set(0.7, 0.7, 0.7);

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
      this.canvas.height = 1024;
      super.resize();
    }

    drawCanvas() {
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.fillStyle = '#111';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.strokeStyle = 'white';
      this.ctx.fillStyle = 'white';
      this.ctx.lineWidth = 1;
      this.ctx.globalCompositeOperation = 'lighter';
      for(let i = 0; i < 32; i++) {
        for(let j = 0; j < 256; j++) {
          this.ctx.strokeRect(
              i / 32 * this.canvas.width,
              j / 32 * this.canvas.height,
              this.canvas.width / 32,
              this.canvas.height / 32);
          if(this.throbbies[i][j] > 1 / 32) {
            this.ctx.globalAlpha = this.throbbies[i][j];
            this.ctx.fillRect(
                i / 32 * this.canvas.width,
                j / 32 * this.canvas.height,
                this.canvas.width / 32,
                this.canvas.height / 32);
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

      for(var i = 0; i < this.numberOfParticles; i++){
        var particle = this.particles[i];
        if(this.throb <= 0) {
          particle.visible = false;
          continue;
        }
        particle.visible = true;
        const scale = this.throb * 0.5;
        particle.scale.set(scale, scale, scale);
      }

      this.cylinder.material.emissiveIntensity = Math.max(this.throb, 0.5);

      this.cylinder.rotation.x = Math.PI / 2;
      //this.camera.position.z = easeOut(250, -120, ((frame - 1233) / 60 / 60 * 105 * 2) % 16) - (frame - 1233) / 10;
      //this.camera.fov = easeOut(85, 25, ((frame - 1233) / 60 / 60 * 105 * 2) % 16);
      this.camera.position.z = +20 -20 * ((frame - 1233) / 60 / 60 * 105 / 4 | 0);
      this.camera.position.z += -(frame - 1233) / 20;
      demo.nm.nodes.bloom.opacity = easeOut(5, .5, ((frame - 1233) / 60 / 60 * 105) % 4);
      if(frame >= 2295) {
        demo.nm.nodes.bloom.opacity += easeOut(.25, 0, (frame - 2295) / 60);
      }
      this.camera.updateProjectionMatrix();
      this.camera.position.x = 3 * Math.sin(frame / 100);
      this.camera.position.y = 3 * Math.cos(frame / 100);

      //this.item.position.z = this.camera.position.z - 30;
      this.item.position.z = -(frame - 1233) / 5;
      this.item.position.x = 0;
      this.item.position.y = 0;
      this.pointLight.position.copy(this.item.position);
      this.pointLight.position.z -= 30;

      const direction = ((frame - 1233) / 60 / 60 * 105 % 8) > 4;
      this.lookAt.x = this.item.position.x + 4 * (direction ? 1 : -1);
      this.lookAt.y = this.item.position.y + 1;
      this.lookAt.z = this.item.position.z;

      this.camera.lookAt(this.lookAt);

      this.item.rotation.x = frame / 33;
      this.item.rotation.y = frame / 42;
      this.item.rotation.z = frame / 52;

      const scale = 0.5 + this.throb * 1.5;
      this.item.scale.set(scale, scale, scale);
      this.item.material.emissiveIntensity = this.throb * this.throb;
      this.pointLight.intensity = 0.05 * this.throb * this.throb;

      this.light.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
    }

    render(renderer) {
      demo.nm.nodes.grading.gammaCorrection = false;
      this.drawCanvas();
      this.cubeCamera.position.copy(this.item.position);
      this.item.visible = false;
      this.cubeCamera.updateCubeMap(renderer, this.scene);
      this.item.visible = true;
      super.render(renderer);
    }
  }

  global.tunnel = tunnel;
})(this);
