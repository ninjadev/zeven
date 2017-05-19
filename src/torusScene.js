(function(global) {
  class torusScene extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      var geometry = this.generateTorusGeom();

      this.cube = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x000fff }));
      this.scene.add(this.cube);

      this.camera.position.z = 100;
    }

    generateTorusGeom() {
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

      return geometry;
    }

    update(frame) {
      super.update(frame);

      this.cube.rotation.x = Math.sin(frame / 10);
      this.cube.rotation.y = Math.cos(frame / 10);
    }
  }

  global.torusScene = torusScene;
})(this);
