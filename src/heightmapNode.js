(function(global) {
  class heightmapNode extends NIN.Node {
    constructor(id, options) {
      super(id, {
        outputs: {
          texture: new NIN.TextureOutput(),
          mntngeom: new NIN.Output()
        }
      });

      //Support for different resolution on heightmap than mesh
      this.mntnWidth = 512;
      this.mntnHeight = 512;
      var meshWidth = 256;
      var widthFactor = this.mntnWidth / meshWidth;
      var meshHeight = 256;
      var heightFactor = this.mntnHeight / meshHeight;

      var startFreq = 1.0/512.0;
      var persistence = 0.42;
      var startAmpl = 1300.0;
      var noiseLevels = 8;

      /////////////
      // Generate height map for the mountains
      ////////////

      var noise = NIN.ImprovedNoise().noise;

      var minH = 1000;
      var maxH = 0;
      this.heightmap = new Array(this.mntnWidth);
      for(var x = 0; x < this.mntnWidth; x++ ){
        this.heightmap[x] = new Array(this.mntnHeight);
        for(var y = 0; y < this.mntnHeight; y++ ){
          var h = 0;
          var ampl = startAmpl;
          var freq = startFreq;
          for(var i = 0; i < noiseLevels; i++){
            h += ampl * noise(x * freq , y * freq ,0);
            freq *= 2;
            ampl *= persistence;
          }
          var val = 1000.0 - Math.abs(h);
          this.heightmap[x][y] = val;

          if(val < minH){
            minH = val;
          }

          if(val > maxH){
            maxH = val;
          }

          //this.heightmapScaled[x][y] = (this.heightmap[x][y]/1000.0);
        }
      }

      var normalizer = maxH - minH;
      this.heightmapScaled = new Uint8Array(3 * this.mntnWidth * this.mntnHeight);
      for(var x = 0; x < this.mntnWidth; x++ ){
        for(var y = 0; y < this.mntnHeight; y++ ){
          var color = ((this.heightmap[x][y] - minH) / normalizer) * 255;
          this.heightmapScaled[3 * (x * this.mntnHeight + y)] = color;
          this.heightmapScaled[3 * (x * this.mntnHeight + y) + 1] = color;
          this.heightmapScaled[3 * (x * this.mntnHeight + y) + 2] = color;
        }
      }

      var heightTexture = new THREE.DataTexture(this.heightmapScaled,
          this.mntnWidth, this.mntnHeight, THREE.RGBFormat);
      heightTexture.needsUpdate = true;

      this.outputs.texture.setValue(heightTexture);

      /////////////////
      // Elevate the geometry
      ////////////////
      this.mntnSizeX = 2000;
      this.mntnSizeY = 2000;
      var mntnGeom = new THREE.PlaneGeometry(this.mntnSizeX, this.mntnSizeY, meshWidth-1, meshHeight-1);
      for(var x = 0; x < meshWidth; x++ ){
        for(var y = 0; y < meshHeight; y++ ){
          mntnGeom.vertices[x*meshWidth+y].z 
            = this.heightmap[x*widthFactor][y*heightFactor];
        }
      }

      mntnGeom.rotateX(-3.1415/2.0);

      mntnGeom.computeFaceNormals();
      mntnGeom.computeVertexNormals();
      mntnGeom.normalsNeedUpdate = true;


      this.outputs.mntngeom.setValue(mntnGeom);
    }
  }


  global.heightmapNode = heightmapNode;
})(this);
