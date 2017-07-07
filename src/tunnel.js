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
          new THREE.CubeGeometry(radius / 2, radius / 2, radius / 2),
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

      this.canvas.width = 1024;
      this.canvas.height = 4096 * 4;
      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.strokeStyle = 'white';
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = 'rgb(60, 132, 252)';
      this.ctx.lineWidth = 1;
      for(let i = 0; i < 32; i++) {
        for(let j = 0; j < 512; j++) {
          this.ctx.strokeRect(
              i / 32 * this.canvas.width,
              j / 512 * this.canvas.height,
              this.canvas.width / 32,
              this.canvas.height / 512);
        }
      }
      this.canvasTexture.needsUpdate = true;

      this.throb = 0;
    }

    update(frame) {
      super.update(frame);

      this.throb *= 0.95;
      if(BEAT && BEAN % 12 == 0) {
        this.throb = 1;
      }
      this.cylinder.material.emissiveIntensity = Math.max(this.throb, 0.5);

      this.cylinder.rotation.x = Math.PI / 2;
      this.camera.position.z = -(frame - 1233) / 20;

      this.item.position.z = this.camera.position.z - 50;
      this.item.position.x = this.camera.position.x;
      this.item.position.y = this.camera.position.y;

      this.item.rotation.x = frame / 33;
      this.item.rotation.y = frame / 42;
      this.item.rotation.z = frame / 52;

      const scale = 0.5 + this.throb;
      this.item.scale.set(scale, scale, scale);


      this.camera.rotation.z = frame / 100;
      this.camera.rotation.y = Math.sin(frame / 300) * 0.3;
      this.camera.rotation.y = Math.cos(frame / 300) * 0.3;
      this.light.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
    }
  }

  global.tunnel = tunnel;
})(this);
