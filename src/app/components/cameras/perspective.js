// @flow
import { Camera, PerspectiveCamera } from 'three'

class Perspective {
    camera : PerspectiveCamera;

    getInstance() : PerspectiveCamera {
        return this.camera;
    }

    constructor() {
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    }
}

export { Perspective }