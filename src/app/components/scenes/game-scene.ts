import { Scene, Light, Object3D } from 'three'
import { Ambient, Directional } from '../lights'
import { Sky } from '../skies/sky'
import { Floor } from '../terrains/floor'

class GameScene {
    private scene: Scene;
    private sky: Sky;
    private floor: Floor;
    private lights: {
        ambient: Ambient
    }

    constructor() {
        this.initScene()
        this.fillScene()
        this.initLights()
    }

    private initScene() : void {
        this.scene = new Scene();
        this.sky = new Sky();
        this.floor = new Floor();
    }
    
    private initLights() : void {
        this.lights = {
            ambient: new Ambient()
        }

        this.scene.add(this.lights.ambient.getInstance());
    }

    private fillScene() : void {
        this.scene.add(this.getSky());
        this.scene.add(this.getFloor());
    }


    public getScene() {
        return this.scene;
    }

    public getSky() {
        if (this.sky) {
            return this.sky.getInstance();
        }
        return null;
    }

    public getFloor() {
        if (this.floor) {
            return this.floor.getInstance();
        }
        return null;
    }
}

export { GameScene }