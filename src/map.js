(function(global) {
  class map extends NIN.THREENode {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        },
        inputs: {
          T0: new NIN.TextureInput(),
          T1: new NIN.TextureInput(),
          T2: new NIN.TextureInput(),
          T3: new NIN.TextureInput(),
          T4: new NIN.TextureInput(),
          T5: new NIN.TextureInput(),
        }
      });


      var light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(50, 50, 50);
      this.scene.add(light);
      this.scene.add(new THREE.AmbientLight(0xffffff, 1.));

      this.heightmap = Loader.loadTexture('res/Heightmap.png');

      this.gridSize = 24;

      this.mountainPlanes = [];
      const mountainPlaneGeometry = new THREE.PlaneBufferGeometry(1, 1);
      for(let i = 0; i < 6; i++) {
        const plane = new THREE.Mesh(
            mountainPlaneGeometry,
            new THREE.MeshBasicMaterial({
              color: 0xff5a3e,
              transparent: true,
              side: THREE.DoubleSide,
            }));
        this.mountainPlanes.push(plane);
        this.scene.add(plane);
        const scale = (this.gridSize / 2 - 3) / this.gridSize * 0.5;
        plane.scale.x = scale;
        plane.scale.y = scale;
        plane.scale.z = scale;
      }


      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');

      this.texture = new THREE.Texture(this.canvas);

      const geometry = new THREE.PlaneBufferGeometry(1, 1, this.gridSize, this.gridSize);
      this.geometry = geometry;

      this.vertices = this.geometry.getAttribute('position');
      this.vertices.dynamic = true;

      const mesh = new THREE.Mesh(
          geometry,
          new THREE.MeshStandardMaterial({
            emissiveMap: this.texture,
            map: this.texture,
            emissive: 0xffffff,
            transparent: true,
            side: THREE.DoubleSide,
          }));

      mesh.rotation.x = Math.PI / 2;

      for(let i = 0; i < this.mountainPlanes.length; i++) {
        const plane = this.mountainPlanes[i];
        plane.rotation.x = Math.PI / 2;
        plane.position.y = (i + 1) / 80;
      }

      this.scene.add(mesh);
      this.camera.position.z = 25;
      this.camera.near = 0.0001;
      this.camera.updateProjectionMatrix();

      this.resize();
    }

    resize() {
      super.resize();
      this.canvas.width = 16 * GU;
      this.canvas.height = 16 * GU;

      const gridWidth = 8;
      const gridHeight = 8;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      const size = 0.03;

      const drawGrid = (gridSize, gridWidth, gridHeight) => {
        for(let i = 0; i <= gridSize; i++) {
          this.ctx.fillRect(
            i / gridSize * gridWidth,
            0,
            size,
            gridHeight + size);
          this.ctx.fillRect(
            0,
            i / gridSize * gridWidth,
            gridWidth + size,
            size);
        }
      };

      const drawWhiskers = (x, y, length) => {
        this.ctx.fillRect(
            x - length,
            y - size * 2,
            length,
            size * 2);

        this.ctx.fillRect(
            x - length,
            y + size * 2,
            length,
            size * 2);
      };
      
      this.ctx.strokeStyle = 'white';
      this.ctx.globalAlpha = 0.8;
      this.ctx.globalCompositeOperation = 'lighten';
      this.ctx.lineWidth = 10;
      this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = '#ba9680';
      this.ctx.save();
      this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.scale(GU, GU);
      this.ctx.save();
      this.ctx.translate(-gridWidth / 2 - size / 2, -gridHeight / 2 - size / 2);

      drawGrid(this.gridSize, gridWidth, gridHeight);

      this.ctx.fillStyle = '#ff5a3e';

      this.ctx.fillRect(
          (this.gridSize + 2) / this.gridSize * gridWidth,
          0,
          size * 2,
          gridHeight);

      this.ctx.fillRect(
          -2 / this.gridSize * gridWidth,
          0,
          size * 2,
          gridHeight);


      for(let i = 0; i < 2; i++) {
        drawWhiskers(
          -2 / this.gridSize * gridWidth + size,
          size * 2,
          gridHeight / 8);

        drawWhiskers(
          -2 / this.gridSize * gridWidth + size,
          gridHeight - size * 4,
          gridHeight / 8);

        drawWhiskers(
          -2 / this.gridSize * gridWidth + gridHeight / 24 + size,
          gridHeight / 2,
          gridHeight / 12);

        drawWhiskers(
          -2 / this.gridSize * gridWidth + size,
          gridHeight / 4 * 3,
          gridHeight / 12);

        drawWhiskers(
          -2 / this.gridSize * gridWidth + size,
          gridHeight / 4,
          gridHeight / 12);
        this.ctx.translate(gridWidth / 2 + size, gridHeight / 2);
        this.ctx.rotate(Math.PI);
        this.ctx.translate(-gridWidth / 2 - size, -gridHeight / 2);
      }

      this.ctx.restore();

      const holeSize = gridWidth / 2 - 1 / this.gridSize * gridWidth;
      this.ctx.clearRect(
          -holeSize / 2,
          -holeSize / 2,
          holeSize,
          holeSize);
      this.ctx.fillRect(-holeSize / 2, -holeSize / 2, holeSize + size, size);
      this.ctx.fillRect(-holeSize / 2, holeSize / 2, holeSize + size, size);
      this.ctx.fillRect(holeSize / 2, -holeSize / 2, size, holeSize + size);
      this.ctx.fillRect(-holeSize / 2, -holeSize / 2, size, holeSize + size);

      const newGridSize = this.gridSize / 2 - 3;
      const newGridWidth = newGridSize / this.gridSize * gridWidth;
      this.ctx.save();
      this.ctx.translate(-newGridWidth / 2, - newGridWidth / 2);
      drawGrid(newGridSize * 2, newGridWidth, newGridWidth);
      this.ctx.restore();
      this.ctx.restore();
      this.texture.needsUpdate = true;
    }

    update(frame) {
      super.update(frame);

      for(let i = 0; i < 6; i++) {
        this.mountainPlanes[i].material.map = this.inputs['T' + i].getValue();
        this.mountainPlanes[i].material.needsUpdate = true;
      }

      this.camera.position.x = 0.75 * Math.sin(frame / 1000);
      this.camera.position.z = 0.75 * Math.cos(frame / 1000);
      this.camera.position.y = 0.75;
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));

      demo.nm.nodes.add.opacity = .5; 

    }

    render(renderer) {
      super.render(renderer);
      renderer.setClearColor(0x1f242a);
    }
  }

  global.map = map;
})(this);
