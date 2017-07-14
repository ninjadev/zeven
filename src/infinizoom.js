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

            this.frames = [];
            for (let i = 0; i <= 1; i++) {
                this.frames[i] = Loader.loadTexture(`res/dream/${leftPad(i.toString(), 4, '0')}.png`);
            }
        }

        update(frame) {
            demo.nm.nodes.bloom.opacity = 0.3;
            demo.nm.nodes.grading.amount = 0;
            demo.nm.nodes.grading.gammaCorrection = 0;
            super.update(frame);
            this.canvas.width += 0;

            this.frame = frame;

            this.ctx.drawImage(this.frames[0].image, 20, 20);
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
