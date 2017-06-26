(function(global) {
  class image extends NIN.Node {
    constructor(id, options) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.texture = Loader.loadTexture(options.path);
      this.outputs.render.setValue(this.texture);
    }
  }

  global.image = image;
})(this);
