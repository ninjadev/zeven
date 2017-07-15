(function (global) {
    class infinizoom extends NIN.THREENode {
        constructor(id) {
            super(id, {
                outputs: {
                    render: new NIN.TextureOutput()
                }
            });

            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.resize();
            this.output = new THREE.VideoTexture(this.canvas);

            this.output.minFilter = THREE.LinearFilter;
            this.output.magFilter = THREE.LinearFilter;

            function leftPad(input, length, str) {
                if (input.length >= length) {
                    return input;
                }
                str = str || ' ';
                return (
                        new Array(Math.ceil((length - input.length) / str.length) + 1).join(str)
                    ).substr(0, (length - input.length)) + input;
            }

            this.imageDimension = 256;
            this.textures = [];
            this.zoomFactor = 2;
            let numLoaded = 0;
            let numImages = 32;

            let cb = function () {
                numLoaded++;
                if (numLoaded === numImages + 1) {
                    allImagesLoaded();
                }
            };

            this.radialBlurTexture = Loader.loadTexture(`res/dream/blur.png`, cb);

            function allImagesLoaded() {
                console.log('all dream images loaded')
            }

            for (let i = 0; i < numImages; i++) {
                this.textures[i] = Loader.loadTexture(`res/dream/${leftPad(i.toString(), 4, '0')}.png`, cb);
            }
        }

        update(frame) {
            const relativeFrame = frame - 2330 + 30;
            demo.nm.nodes.bloom.opacity = 0.3;
            demo.nm.nodes.grading.amount = 1;
            demo.nm.nodes.grading.gammaCorrection = true;
            super.update(frame);
            this.canvas.width += 0;
            this.ctx.save();
            this.ctx.scale(GU, GU);

            this.frame = frame;

            let zoomLevel = relativeFrame / 30;

            for (let i = 0; i < this.textures.length; i++) {
                let texture = this.textures[i];
                let scaleFactor = Math.pow(0.5, i) * Math.pow(2, zoomLevel);
                if (scaleFactor > 12) {
                    // TODO: very large, fade out and then don't draw
                } else {
                    let dimension = 9 * scaleFactor;
                    // TODO: if very small, don't draw image. remember fade.
                    this.ctx.drawImage(
                        texture.image,
                        19 / 2 - dimension / 2,
                        9 / 2 - dimension / 2,
                        dimension,
                        dimension
                    )
                }
            }
            this.ctx.restore();
        }

        resize() {
            this.canvas.width = 16 * GU;
            this.canvas.height = 9 * GU;
        }

        render() {
            this.output.needsUpdate = true;
            this.outputs.render.setValue(this.output);
        }
    }

    global.infinizoom = infinizoom;
})(this);
