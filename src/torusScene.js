(function(global) {
  class torusScene extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });
      
      var light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(10, 10, 10);
      this.scene.add(light);


      var light2 = new THREE.PointLight(0xffffff, 1, 100);
      light2.position.set(-10, -10, -10);
      this.scene.add(light2);

      //var ambientLight = new THREE.AmbientLight(0x606060);
      var ambientLight = new THREE.AmbientLight(0xFFFFFF);
      this.scene.add(ambientLight);

      this.center_tunnel_radi = 6;
      this.tunnel_radi = 2;
      this.sections = 40;
      this.subsections = 40;
      this.torus_geometry = this.generateTorusGeom(this.center_tunnel_radi, this.tunnel_radi, this.sections, this.subsections);
      this.greet_geometry = this.generateGreetGeom(this.center_tunnel_radi, this.tunnel_radi, this.sections, this.subsections);

      let skyboxmap = Loader.loadTexture('res/gradient.jpg');
      var torus_material = new THREE.MeshPhysicalMaterial({color: 0xffffff, map: skyboxmap, shading: THREE.SmoothShading});
      let greetmap = Loader.loadTexture('res/checkered-skybox.png');
      var greet_material = new THREE.MeshPhysicalMaterial({color: 0xffffff, map: greetmap, shading: THREE.SmoothShading});
      this.torus = new THREE.Mesh(this.torus_geometry, torus_material);
      this.greets = new THREE.Mesh(this.greet_geometry, greet_material);
      this.scene.add(this.torus);
      this.scene.add(this.greets);

      //this.greets.position.y = 5;

      this.camera.position.z = 20;
    }

    generateTorusGeom(center_tunnel_radi, tunnel_radi, sections, subsections) {
      var geometry = new THREE.Geometry();

      var vertices = [];
      this.uv_map_vertices = [];

      for (var i = 0; i < sections; i++) {
        // Find the position of the center of the torus (a cirle).
        var subsection_center_vect = new THREE.Vector3(Math.sin(i * Math.PI * 2 / sections), 0, Math.cos(i * Math.PI * 2 / sections));
        for (var j = 0; j < subsections; j++) {
          // Find the vector from the center of the torus to the outer perimiter.
          var subsection_surface_vect = new THREE.Vector3(subsection_center_vect.x * Math.sin(j * Math.PI * 2 / subsections), 
                                                          Math.cos(j * Math.PI * 2 / subsections),
                                                          subsection_center_vect.z * Math.sin(j * Math.PI * 2 / subsections)
                                                         );
          subsection_surface_vect.multiplyScalar(tunnel_radi);

          // Add the new point.
          vertices.push(new THREE.Vector3(subsection_center_vect.x * center_tunnel_radi + subsection_surface_vect.x,
                                          subsection_center_vect.y + subsection_surface_vect.y,
                                          subsection_center_vect.z * center_tunnel_radi + subsection_surface_vect.z,
                                          ));
          geometry.vertices.push(vertices[vertices.length - 1]);

          this.uv_map_vertices.push(new THREE.Vector2(i / sections, j / subsections));
        }
      }

      for (var i = 0; i < sections; i++) {
        for (var j = 0; j < subsections; j++) { 
          // Add faces to the geometry
          var x1 = i * sections + j;
          var y1 = i * sections + ((j + 1) % (subsections));
          var z1 = ((i + 1) % sections) * sections + j;
          var x2 = i * sections + ((j + 1) % (subsections));
          var y2 = ((i + 1) % sections) * sections + ((j + 1) % (subsections));
          var z2 = ((i + 1) % sections) * sections + j;

          geometry.faces.push( new THREE.Face3(x1, y1, z1));
          geometry.faces.push( new THREE.Face3(x2, y2, z2));

          geometry.faceVertexUvs[0][(i * subsections + j) * 2] = [this.uv_map_vertices[x1], this.uv_map_vertices[y1], this.uv_map_vertices[z1]];
          geometry.faceVertexUvs[0][(i * subsections + j) * 2 + 1] = [this.uv_map_vertices[x2], this.uv_map_vertices[y2], this.uv_map_vertices[z2]];
        }
      }

      geometry.computeFaceNormals();
      geometry.computeVertexNormals();

      return geometry;
    }

    generateGreetGeom(center_tunnel_radi, tunnel_radi, sections, subsections) {
      var geometry = new THREE.Geometry();

      var vertices = [];
      this.uv_map_vertices2 = [];

      for (var i = 0; i < sections; i++) {
        // Find the position of the center of the torus (a cirle).
        var subsection_center_vect = new THREE.Vector3(Math.sin(i * Math.PI * 2 / sections), 0, Math.cos(i * Math.PI * 2 / sections));
        for (var j = 0; j < subsections; j++) {
          // Find the vector from the center of the torus to the outer perimiter.
          var subsection_surface_vect = new THREE.Vector3(subsection_center_vect.x * Math.sin(j * Math.PI * 2 / subsections), 
                                                          Math.cos(j * Math.PI * 2 / subsections),
                                                          subsection_center_vect.z * Math.sin(j * Math.PI * 2 / subsections)
                                                         );
          subsection_surface_vect.multiplyScalar(tunnel_radi);

          // Add the new point.
          vertices.push(new THREE.Vector3(subsection_center_vect.x * center_tunnel_radi + subsection_surface_vect.x,
                                          subsection_center_vect.y + subsection_surface_vect.y,
                                          subsection_center_vect.z * center_tunnel_radi + subsection_surface_vect.z,
                                          ));
          geometry.vertices.push(vertices[vertices.length - 1]);

          this.uv_map_vertices2.push(new THREE.Vector2(i / sections, j / subsections));
        }
      }

      for (var i = 0; i < sections; i++) {
        for (var j = 0; j < subsections; j++) { 
          // Add faces to the geometry
          var x1 = i * sections + j;
          var y1 = i * sections + ((j + 1) % (subsections));
          var z1 = ((i + 1) % sections) * sections + j;
          var x2 = i * sections + ((j + 1) % (subsections));
          var y2 = ((i + 1) % sections) * sections + ((j + 1) % (subsections));
          var z2 = ((i + 1) % sections) * sections + j;

          geometry.faces.push( new THREE.Face3(x1, y1, z1));
          geometry.faces.push( new THREE.Face3(x2, y2, z2));

          geometry.faceVertexUvs[0][(i * subsections + j) * 2] = [this.uv_map_vertices[x1], this.uv_map_vertices[y1], this.uv_map_vertices[z1]];
          geometry.faceVertexUvs[0][(i * subsections + j) * 2 + 1] = [this.uv_map_vertices[x2], this.uv_map_vertices[y2], this.uv_map_vertices[z2]];
        }
      }

      geometry.computeFaceNormals();
      geometry.computeVertexNormals();

      return geometry;
    }

    update(frame) {
      super.update(frame);

      //demo.nm.nodes.add.opacity = 1;

      this.camera.position.x = 20 * Math.sin( frame / 100);
      this.camera.position.y = 20 * Math.sin( frame / 90);
      this.camera.position.z = 20 * Math.sin( frame / 60);
      this.camera.lookAt(new THREE.Vector3(0,0,0));
      var subsection_center_vect = new THREE.Vector3();
      var subsection_surface_vect = new THREE.Vector3();

      for (var i = 0; i < this.sections; i++) {
        // Find the position of the center of the torus (a cirle).
        subsection_center_vect.set(Math.sin(i * Math.PI * 2 / this.sections), 0, Math.cos(i * Math.PI * 2 / this.sections));
        for (var j = 0; j < this.subsections; j++) {
          // Find the vector from the center of the torus to the outer perimiter.
          subsection_surface_vect.set(subsection_center_vect.x * Math.sin(j * Math.PI * 2 / this.subsections), 
                                                          Math.cos(j * Math.PI * 2 / this.subsections),
                                                          subsection_center_vect.z * Math.sin(j * Math.PI * 2 / this.subsections)
                                                         );
          var intensity = 0.5 + Math.sin(3 * Math.PI * 2 * (i + j  * (0.5 + 0.5 * Math.sin(frame/ 100)) )/ this.sections) / 2;
          subsection_surface_vect.multiplyScalar(this.tunnel_radi * (0.5 + intensity / 1.5));
          // Add the new point of torus.
          this.torus_geometry.vertices[i * this.subsections + j].x = subsection_center_vect.x * this.center_tunnel_radi + subsection_surface_vect.x;
          this.torus_geometry.vertices[i * this.subsections + j].y = subsection_center_vect.y + subsection_surface_vect.y;
          this.torus_geometry.vertices[i * this.subsections + j].z = subsection_center_vect.z * this.center_tunnel_radi + subsection_surface_vect.z;

          if (frame < FRAME_FOR_BEAN(1780)) {
            subsection_surface_vect.multiplyScalar((1 + Math.sin(frame / 2.5 + i * 1) / 3) * 1);
          } else {
            subsection_surface_vect.multiplyScalar((1 + Math.sin((frame / 2.5 + i * 0.8)) / 5) * (1 - 0.8 * Math.sin((frame + i) / this.sections * Math.PI * 2) ));
          }
          // Add the new point of greet.
          this.greet_geometry.vertices[i * this.subsections + j].x = subsection_center_vect.x * this.center_tunnel_radi + subsection_surface_vect.x;
          this.greet_geometry.vertices[i * this.subsections + j].y = subsection_center_vect.y + subsection_surface_vect.y;
          this.greet_geometry.vertices[i * this.subsections + j].z = subsection_center_vect.z * this.center_tunnel_radi + subsection_surface_vect.z;

          this.uv_map_vertices[i * this.subsections + j].set(
            0.5 + (Math.sin(i / this.sections * Math.PI * 2) / 2) * intensity,
            0.5 + (Math.cos(i / this.sections * Math.PI * 2) / 2) * intensity
          );
          this.uv_map_vertices2[i * this.subsections + j].set(i/this.sections, j/this.subsections);
        }
      }
      for (var i = 0; i < this.sections; i++) {
        for (var j = 0; j < this.subsections; j++) {
          var x1 = i * this.sections + j;
          var y1 = i * this.sections + ((j + 1) % (this.subsections));
          var z1 = ((i + 1) % this.sections) * this.sections + j;
          var x2 = i * this.sections + ((j + 1) % (this.subsections));
          var y2 = ((i + 1) % this.sections) * this.sections + ((j + 1) % (this.subsections));
          var z2 = ((i + 1) % this.sections) * this.sections + j;

          this.torus_geometry.faceVertexUvs[0][(i * this.subsections + j) * 2] = [this.uv_map_vertices[x1], this.uv_map_vertices[y1], this.uv_map_vertices[z1]];
          this.torus_geometry.faceVertexUvs[0][(i * this.subsections + j) * 2 + 1] = [this.uv_map_vertices[x2], this.uv_map_vertices[y2], this.uv_map_vertices[z2]];

          this.greet_geometry.faceVertexUvs[0][(i * this.subsections + j) * 2] = [this.uv_map_vertices[x1], this.uv_map_vertices[y1], this.uv_map_vertices[z1]];
          this.greet_geometry.faceVertexUvs[0][(i * this.subsections + j) * 2 + 1] = [this.uv_map_vertices[x2], this.uv_map_vertices[y2], this.uv_map_vertices[z2]];
        }
      }
      this.torus_geometry.verticesNeedUpdate = true;
      this.torus_geometry.uvsNeedUpdate = true;
      this.torus_geometry.colorsNeedUpdate = true;
      this.torus_geometry.groupsNeedsUpdate = true;
      this.torus_geometry.normalsNeedsUpdate = true;

      this.greet_geometry.verticesNeedUpdate = true;
      this.greet_geometry.uvsNeedUpdate = true;
      this.greet_geometry.colorsNeedUpdate = true;
      this.greet_geometry.groupsNeedsUpdate = true;
      this.greet_geometry.normalsNeedsUpdate = true;
    }
  }

  global.torusScene = torusScene;
})(this);
