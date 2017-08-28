import { AmbientLight } from "three"

class Ambient {
    private light: AmbientLight;
    
    constructor() {
        this.light = new AmbientLight(0x333333);
    }

    public getInstance() : AmbientLight {
        return this.light;
    }
}

export { Ambient }
