(function(global) {
  class torusScene extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      var geometry = this.generateTorusGeom(6, 3, 16, 16);

      this.cube = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x000fff }));
      this.scene.add(this.cube);

      this.camera.position.z = 100;
    }

    generateTorusGeom(center_tunnel_radi, tunnel_radi, sections, subsections) {
      var geometry = new THREE.Geometry();

      var vertices = [];

      for (var i = 0; i < sections; i++) {
        var subsection_center_vect = new THREE.Vector3(Math.sin(i * Math.PI * 2 / sections), 0, Math.cos(i * Math.PI * 2 / sections));
        //subsection_center_vect.normalize();
        for (var j = 0; j < subsections; j++) {
          var subsection_surface_vect = new THREE.Vector3(subsection_center_vect.x * Math.sin(j * Math.PI * 2 / subsections), 
                                                          Math.cos(j * Math.PI * 2 / subsections),
                                                          subsection_center_vect.z * Math.sin(j * Math.PI * 2 / subsections)
                                                         );
          //subsection_surface_vect.normalize();
          subsection_surface_vect.multiplyScalar(tunnel_radi);
          //subsection_center_vect.normalize();
          //subsection_center_vect.multiplyScalar(center_tunnel_radi);

          //subsection_center_vect.add(subsection_surface_vect);

          vertices.push(new THREE.Vector3(subsection_center_vect.x * center_tunnel_radi + subsection_surface_vect.x,
                                          subsection_center_vect.y + subsection_surface_vect.y,
                                          subsection_center_vect.z * center_tunnel_radi + subsection_surface_vect.z,
                                          ));

          geometry.vertices.push(vertices[vertices.length - 1]);

          //console.log(geometry.vertices[geometry.vertices.length - 1]);
        }
      }

      for (var i = 0; i < sections; i++) {
        for (var j = 0; j < subsections; j++) {
          geometry.faces.push( new THREE.Face3(i * sections + j,
                                               i * sections + ((j + 1) % (subsections)),
                                               ((i + 1) % sections) * sections + j
                                               ));
          geometry.faces.push( new THREE.Face3(i * sections + ((j + 1) % (subsections)),
                                               ((i + 1) % sections) * sections + ((j + 1) % (subsections)),
                                               ((i + 1) % sections) * sections + j
                                               ));
        }
      }
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

      //this.cube.rotation.x = Math.sin(frame / 10);
      //this.cube.rotation.y = Math.cos(frame / 10);

      this.camera.position.x = 30 * Math.sin( frame / 100);
      this.camera.position.y = 30 * Math.sin( frame / 90);
      this.camera.position.z = 30 * Math.sin( frame / 60);
      this.camera.lookAt(new THREE.Vector3(0,0,0));
    }
  }

  global.torusScene = torusScene;
})(this);
