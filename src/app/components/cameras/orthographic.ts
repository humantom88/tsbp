import { OrthographicCamera, Camera } from 'three'

class Orthographic {
    private camera : OrthographicCamera
    constructor () {
        const frustumSize = 1000;
        const aspect = window.innerWidth / window.innerHeight
        this.camera = new OrthographicCamera(
            frustumSize * aspect / - 2,
            frustumSize * aspect / 2,
            frustumSize / 2,
            frustumSize / - 2,
            1,
            2000
        );
        this.camera.position.y = 12;
    }

    public getInstance() : Camera {
        return this.camera;
    }
}

export { Orthographic }