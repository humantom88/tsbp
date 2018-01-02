import { Camera, PerspectiveCamera } from 'three'

class Perspective {
    private camera : PerspectiveCamera;

    public getInstance() : PerspectiveCamera {
        return this.camera
    }

    constructor() {
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    }
}

export { Perspective }