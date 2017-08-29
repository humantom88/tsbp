import { AmbientLight } from "three"

class Ambient {
    private light: AmbientLight;
    
    constructor() {
        this.light = new AmbientLight(0xeaeaea);
    }

    public getInstance() : AmbientLight {
        return this.light;
    }
}

export { Ambient }
