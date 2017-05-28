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

      var ambientLight = new THREE.AmbientLight(0x0c0c0c);
      this.scene.add(ambientLight);

      var geometry = this.generateTorusGeom(6, 3, 56, 56);

      //var torus_material = new THREE.MeshPhongMaterial({color: 0x7777ff});
      var torus_material = new THREE.MeshStandardMaterial({color: 0x7777ff});
      //  var torus_material = new THREE.MeshBasicMaterial({color: 0x000fff});
      this.torus = new THREE.Mesh(geometry, torus_material);
      this.scene.add(this.torus);


      var tmp_cube = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), torus_material);
      this.scene.add(tmp_cube);

      this.camera.position.z = 100;
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

      console.log(geometry.faceVertexUvs[0]);

/*
      var geometry = new THREE.Geometry(); 
      
      var lv0 = new THREE.Vector3(4,0,4);
      var lv1 = new THREE.Vector3(3,0,3);
      var lv2 = new THREE.Vector3(4,0,-4);
      var lv3 = new THREE.Vector3(3,0,-3);
      var lv4 = new THREE.Vector3(-4,0,4);
      var lv5 = new THREE.Vector3(-3,0,3);
      var lv6 = new THREE.Vector3(-4,0,-4);
      var lv7 = new THREE.Vector3(-3,0,-3);

      geometry.vertices.push(lv0);
      geometry.vertices.push(lv1);
      geometry.vertices.push(lv2);
      geometry.vertices.push(lv3);
      geometry.vertices.push(lv4);
      geometry.vertices.push(lv5);
      geometry.vertices.push(lv6);
      geometry.vertices.push(lv7);

      geometry.faces.push( new THREE.Face3( 0, 2, 1 ) );
      geometry.faces.push( new THREE.Face3( 1, 2, 3 ) );
      geometry.faces.push( new THREE.Face3( 0, 1, 5 ) );
      geometry.faces.push( new THREE.Face3( 0, 5, 4 ) );
      geometry.faces.push( new THREE.Face3( 4, 5, 7 ) );
      geometry.faces.push( new THREE.Face3( 4, 7, 6 ) );
      geometry.faces.push( new THREE.Face3( 3, 2, 6 ) );
      geometry.faces.push( new THREE.Face3( 3, 6, 7 ) );

      var lt0 = new THREE.Vector2( 1, 1 );
      var lt1 = new THREE.Vector2( 7/8, 7/8 );
      var lt2 = new THREE.Vector2( 1, 0 );
      var lt3 = new THREE.Vector2( 7/8, 1/8 );
      var lt4 = new THREE.Vector2( 0, 1 );
      var lt5 = new THREE.Vector2( 1/8, 7/8 );
      var lt6 = new THREE.Vector2( 0, 0 );
      var lt7 = new THREE.Vector2( 1/8, 1/8 );

      geometry.faceVertexUvs[0][0] = [lt0, lt2, lt1];
      geometry.faceVertexUvs[0][1] = [lt1, lt2, lt3];
      geometry.faceVertexUvs[0][2] = [lt0, lt1, lt5];
      geometry.faceVertexUvs[0][3] = [lt0, lt5, lt4];
      geometry.faceVertexUvs[0][4] = [lt4, lt5, lt7];
      geometry.faceVertexUvs[0][5] = [lt4, lt7, lt6];
      geometry.faceVertexUvs[0][6] = [lt3, lt2, lt6];
      geometry.faceVertexUvs[0][7] = [lt3, lt6, lt7];
*/
      return geometry;
    }

    update(frame) {
      super.update(frame);

      this.camera.position.x = 30 * Math.sin( frame / 100);
      this.camera.position.y = 30 * Math.sin( frame / 90);
      this.camera.position.z = 30 * Math.sin( frame / 60);
      this.camera.lookAt(new THREE.Vector3(0,0,0));
    }
  }

  global.torusScene = torusScene;
})(this);
