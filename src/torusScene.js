(function(global) {
  class torusScene extends NIN.THREENode {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });
      
      this.camera.position.z = 20;

      var light = new THREE.PointLight(0xffffff, 1, 0, 2);
      light.position.set(10, 10, 10);
      light.physicallyCorrectLights = true;
      this.scene.add(light);


      var light2 = new THREE.PointLight(0xffffff, 1, 0, 2);
      light2.position.set(-10, -10, -10);
      light2.physicallyCorrectLights = true;
      this.scene.add(light2);

      var waterNormals = Loader.loadTexture('res/waternormals.jpg');
      waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping; 
      this.water = new THREE.Water(this.renderer, this.camera, this.scene, {
        textureWidth: 512, 
        textureHeight: 512,
        alpha:  1.0,
        waterNormals: waterNormals,
        sunDirection: light.position.normalize(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 50.0
      });
      var waterMesh = new THREE.Mesh(
          new THREE.PlaneBufferGeometry(7777, 7777, 10, 10),
          this.water.material);
      waterMesh.add(this.water);
      waterMesh.rotation.x = - Math.PI * 0.5;
      this.scene.add(waterMesh);
      waterMesh.position.y = - 16;
      this.waterMesh = waterMesh;

      //Skybox
      var materialArray = [];
      materialArray.push(new THREE.MeshBasicMaterial( { map: Loader.loadTexture( 'res/skyboxsun25deg/1.jpg' ) })); //right
      materialArray.push(new THREE.MeshBasicMaterial( { map: Loader.loadTexture( 'res/skyboxsun25deg/4.jpg' ) })); //left
      materialArray.push(new THREE.MeshBasicMaterial( { map: Loader.loadTexture( 'res/skyboxsun25deg/3.jpg' ) })); //top
      materialArray.push(new THREE.MeshBasicMaterial( { map: Loader.loadTexture( 'res/skyboxsun25deg/6.jpg' ) })); //bottom
      materialArray.push(new THREE.MeshBasicMaterial( { map: Loader.loadTexture( 'res/skyboxsun25deg/5.jpg' ) }));
      materialArray.push(new THREE.MeshBasicMaterial( { map: Loader.loadTexture( 'res/skyboxsun25deg/2.jpg' ) }));

      for (var i = 0; i < 6; i++) {
        materialArray[i].side = THREE.BackSide;
        let color = 0.6;
        materialArray[i].color.setRGB(color, color, color);
      }
      var skyboxMaterial = new THREE.MeshFaceMaterial( materialArray );

      var skyboxMesh  = new THREE.Mesh( 
          new THREE.BoxGeometry( 7777, 7777, 7777 ),
          skyboxMaterial );

      this.skybox = skyboxMesh;
      this.scene.add(this.skybox);


      var ambientLight = new THREE.AmbientLight(0x111111);
      this.scene.add(ambientLight);

      this.center_tunnel_radi = 3;
      this.tunnel_radi = 1;
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

      var prefix = 'res/silo/';
      this.base = [];
      this.base.push(new THREE.Object3D());

      this.lamp = [];
      this.lamp.push(new THREE.Object3D());
      this.lamp.push(new THREE.Object3D());
      this.lamp.push(new THREE.Object3D());
      this.lamp.push(new THREE.Object3D());
      this.lamp.push(new THREE.Object3D());
      this.lamp.push(new THREE.Object3D());
      this.lamp.push(new THREE.Object3D());

      var loadObject = function(objPath, material, three_object, num_instances) {
        var objLoader = new THREE.OBJLoader();
        Loader.loadAjax(objPath, function(text) {
          var object = [];
          for (var i = 0; i < num_instances; i++)
          {
            object.push(objLoader.parse(text));
            object[i].traverse(function(child) {
              if (child instanceof THREE.Mesh) {
                  child.material = material;
              }
            });
          }
          for (i = 0; i < num_instances; i++)
          {
            three_object[i].add(object[i]);
          }
        });
      };
      let concreteMaterial = new THREE.MeshStandardMaterial({
        color: 0x373737,
        side: THREE.DoubleSide,
        roughness: 1,
        roughnessMap: Loader.loadTexture('res/cliff_rocks.jpg'),
        metalness: 0,
        map: Loader.loadTexture('res/concrete.jpg'),
      });
      loadObject(prefix + 'base.obj', concreteMaterial, this.base, 1);
      loadObject(prefix + 'lamp.obj', concreteMaterial, this.lamp, 7);

      this.scene.add(this.base[0]);

      for (var i = 0; i < 7; i++)
      {
        this.lamp[i].rotation.set(0,i * Math.PI * 2 / 7,0);
      }

      this.scene.add(this.lamp[0]);
      this.scene.add(this.lamp[1]);
      this.scene.add(this.lamp[2]);
      this.scene.add(this.lamp[3]);
      this.scene.add(this.lamp[4]);
      this.scene.add(this.lamp[5]);
      this.scene.add(this.lamp[6]);

      var ring_diam = 5.1;
      var multiplyer = 1.1;
      var height_difference = -0.4;

      this.ring1 = new THREE.Mesh(new THREE.TorusGeometry( ring_diam, 0.1, 16, 100 ),
                                 new THREE.MeshBasicMaterial({ color: 0x444454 }));
      this.ring1.position.y = 6 * height_difference;
      this.ring1.rotation.x = Math.PI/2;
      this.scene.add(this.ring1);

      this.ring1 = new THREE.Mesh(new THREE.TorusGeometry( ring_diam * Math.pow(multiplyer, 1), 0.1, 16, 100 ),
                                 new THREE.MeshBasicMaterial({ color: 0x444454 }));
      this.ring1.position.y = 5 * height_difference;
      this.ring1.rotation.x = Math.PI/2;
      this.scene.add(this.ring1);

      this.ring1 = new THREE.Mesh(new THREE.TorusGeometry( ring_diam * Math.pow(multiplyer, 2), 0.1, 16, 100 ),
                                 new THREE.MeshBasicMaterial({ color: 0x444454 }));
      this.ring1.position.y = 4 * height_difference;
      this.ring1.rotation.x = Math.PI/2;
      this.scene.add(this.ring1);

      this.ring1 = new THREE.Mesh(new THREE.TorusGeometry( ring_diam * Math.pow(multiplyer, 3), 0.1, 16, 100 ),
                                 new THREE.MeshBasicMaterial({ color: 0x444454 }));
      this.ring1.position.y = 3 * height_difference;
      this.ring1.rotation.x = Math.PI/2;
      this.scene.add(this.ring1);

      this.ring1 = new THREE.Mesh(new THREE.TorusGeometry( ring_diam * Math.pow(multiplyer, 4), 0.1, 16, 100 ),
                                 new THREE.MeshBasicMaterial({ color: 0x444454 }));
      this.ring1.position.y = 2 * height_difference;
      this.ring1.rotation.x = Math.PI/2;
      this.scene.add(this.ring1);

      this.ring1 = new THREE.Mesh(new THREE.TorusGeometry( ring_diam * Math.pow(multiplyer, 5), 0.1, 16, 100 ),
                                 new THREE.MeshBasicMaterial({ color: 0x444454 }));
      this.ring1.position.y = 1 * height_difference;
      this.ring1.rotation.x = Math.PI/2;
      this.scene.add(this.ring1);

      this.ring1 = new THREE.Mesh(new THREE.TorusGeometry( ring_diam * Math.pow(multiplyer, 6), 0.1, 16, 100 ),
                           new THREE.MeshBasicMaterial({ color: 0x444454 }));
      this.ring1.position.y = 1 * height_difference;
      this.ring1.rotation.x = Math.PI/2;
      this.scene.add(this.ring1);

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
          vertices.push(
              new THREE.Vector3(
                subsection_center_vect.x * center_tunnel_radi +
                  subsection_surface_vect.x,
                subsection_center_vect.y + subsection_surface_vect.y,
                subsection_center_vect.z * center_tunnel_radi +
                subsection_surface_vect.z));
          geometry.vertices.push(vertices[vertices.length - 1]);

          this.uv_map_vertices.push(new THREE.Vector2(i / sections, j / subsections));
        }
      }

      for (i = 0; i < sections; i++) {
        for (j = 0; j < subsections; j++) { 
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
          vertices.push(
              new THREE.Vector3(
                subsection_center_vect.x * center_tunnel_radi +
                  subsection_surface_vect.x,
                subsection_center_vect.y + subsection_surface_vect.y,
                subsection_center_vect.z * center_tunnel_radi +
                  subsection_surface_vect.z));
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

      this.water.material.uniforms.time.value = frame / 60;
      //this.water.sunColor.setRGB(this.light.intensity, this.light.intensity, this.light.intensity);

      if(BEAN < 3312) {
        this.skybox.visible = false;
      } else {
        this.skybox.visible = true;
      }

      demo.nm.nodes.bloom.opacity = 0.5;

      var start_cut1 = 8916;
      var start_cut2 = 9226;
      var mode = 0;
      var amount = 1;

      if (frame < start_cut2) {
        var progression = (frame - start_cut1) / (start_cut2 - start_cut1);
        var scale = 0.1 + 0.9 * progression;
        this.torus.scale.set(scale, scale, scale);
        this.greets.scale.set(scale, scale, scale);

        var positionX = 0;
        var positionY = 40;
        var positionZ = 0;
        this.torus.position.set(positionX, positionY, positionZ);
        this.greets.position.set(positionX, positionY, positionZ);

        this.torus.rotation.x = Math.PI;
        this.greets.rotation.x = Math.PI;

        var cameraPositionX = 0;
        var cameraPositionY = 45;
        var cameraPositionZ = 5;
        this.camera.position.set(cameraPositionX, cameraPositionY, cameraPositionZ);

        mode = 0;
        amount = -Math.cos(progression * Math.PI );

        this.camera.lookAt(this.torus.position);
      } else {
        var scale = 1;
        this.torus.scale.set(scale, scale, scale);
        this.greets.scale.set(scale, scale, scale);

        var positionX = 4 * Math.sin(frame / 100);
        var positionY = 3;
        var positionZ = 4 *  Math.cos(frame / 100);
        this.torus.position.set(positionX, positionY, positionZ);
        this.greets.position.set(positionX, positionY, positionZ);

        var cameraPositionX = 30 * Math.sin(frame / 100);
        var cameraPositionY = 5;
        var cameraPositionZ = 30 *  Math.cos(frame / 100);
        this.camera.position.set(cameraPositionX, cameraPositionY, cameraPositionZ);

        this.camera.lookAt(this.torus.position);

        mode = 1;
        amount = Math.cos(progression * Math.PI * 2);
      }



      const beanOffset = 48 * 8;

      //demo.nm.nodes.add.opacity = 1;


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

          if (mode == 0) {
            subsection_surface_vect.multiplyScalar((1 + Math.sin(frame / 2.5 + i * 1) / 3) * amount);
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

    render(renderer) {
      this.waterMesh.visible = false;
      if(BEAN >= 3312) {
        this.waterMesh.visible = true;
        this.water.renderer = renderer;
        this.water.render();
      }
      super.render(renderer);
    }

    warmup(renderer) {
      this.update(10257);
      this.render(renderer);
    }
  }

  global.torusScene = torusScene;
})(this);
