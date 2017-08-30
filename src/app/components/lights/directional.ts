import { DirectionalLight } from "three"

class Directional {
    private light : DirectionalLight;
    
    constructor() {
        this.light = new DirectionalLight(0x999999, 1.75)
        this.light.position.set(50, 200, 100)
        this.light.position.multiplyScalar(1.3)
            
        this.light.castShadow = true
        this.light.shadow.mapSize.width = 1024
        this.light.shadow.mapSize.height = 1024

        const d = 300
        this.light.shadow.camera.left = -d
        this.light.shadow.camera.right = d
        this.light.shadow.camera.top = d
        this.light.shadow.camera.bottom = -d
        this.light.shadow.camera.far = 1000
    }

    public getInstance() : DirectionalLight {
        return this.light;
    }
}

export { Directional }