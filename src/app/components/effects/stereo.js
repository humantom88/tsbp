// @flow
import { StereoCamera, Renderer, Scene, Camera  } from 'three'

class StereoEffect {
    aspect : number = 0.5;
    stereo : StereoCamera;
    renderer : Renderer;
    eyeSep : number;
    
    initStereoCamera() {
        this.stereo = new StereoCamera()
    }

    setEyeSeparation = (eyeSep : number) : void => {
        this.eyeSep = eyeSep
    }

    setSize = (width : number, height : number) : void => {
        this.renderer.setSize(width, height)
    }

    setRenderer = (renderer : Renderer) => {
        this.renderer = renderer
    }

    getRenderer = () : Renderer => {
        return this.renderer
    }

    constructor(renderer: Renderer) {
        this.setRenderer(renderer)
        this.initStereoCamera()
    }

    render = function(scene: Scene, camera: Camera) : void {
        scene.updateMatrixWorld(true)
        
        if (camera.parent === null) {
            camera.updateMatrixWorld(true)
        }

        this.stereo.update(camera)

        const size = this.renderer.getSize()

        if (this.renderer.autoClear) {
            this.renderer.clear()
        }
        this.renderer.setScissorTest(true)

        this.renderer.setScissor(0, 0, size.width / 2, size.height)
        this.renderer.setViewport(0, 0, size.width / 2, size.height)
        this.renderer.render(scene, this.stereo.cameraL)

        this.renderer.setScissor(size.width / 2, 0, size.width / 2, size.height)
        this.renderer.setViewport(size.width / 2, 0, size.width / 2, size.height)
        this.renderer.render(scene, this.stereo.cameraR)

        this.renderer.setScissorTest(false)
    }
}

export { StereoEffect }
