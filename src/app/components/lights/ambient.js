// @flow
import { AmbientLight } from "three"

class Ambient {
    light: AmbientLight;
    
    constructor() {
        this.light = new AmbientLight(0xeaeaea);
    }

    getInstance() : AmbientLight {
        return this.light;
    }
}

export { Ambient }
