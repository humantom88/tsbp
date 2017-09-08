import { Scene, Light, Object3D, Mesh, Vector3, Quaternion, Fog } from 'three'
import { Box as ModelBox, generateBoxes } from '../shapes/box'
import * as _ from "lodash";
import { Ball as ModelBall } from '../shapes/ball'
import { Body } from 'cannon'
import { Physics } from '../physics'
import { Ambient, Directional } from '../lights'
import { Sky } from '../skies/sky'
import { Floor } from '../terrains/floor'
import { createPoles } from '../shapes/pole'

class GameScene {
    private scene: Scene;
    private sky: Sky;
    private fog: Fog;
    private floor: Floor;
    private physics: Physics;
    private lights: {
        ambient: Ambient,
        // directional: Directional
    }
    private ball : ModelBall;
    private socket : any;
    // --- For example only ---
    private boxes : Array<ModelBox>;
    // ------------------------

    public getBall () : ModelBall {
        return this.ball;
    }

    public setPhysics(physics: Physics) : void {
        this.physics = physics
    }

    constructor(physics: Physics, socket: any) {
        this.setSocket(socket)
        this.initScene()
        this.fillScene()
        this.initLights()
        this.setPhysics(physics)
        this.initFog()
    }

    private setSocket (socket: any) : void {
        this.socket = socket;
    }

    private initFog() : void {
        this.fog = new Fog(0xcce0ff, 500, 1000)
    }

    private initScene() : void {
        this.scene = new Scene();
        this.sky = new Sky();
        this.floor = new Floor();
    }
    
    private initLights() : void {
        this.lights = {
            ambient: new Ambient(),
            // directional: new Directional()
        }

        this.scene.add(this.lights.ambient.getInstance());
        // this.scene.add(this.lights.directional.getInstance()); // TODO: For sun shadows
    }

    private fillScene() : void {
        this.scene.add(this.getSky());
        this.scene.add(this.getFloor());
    }


    public getScene() : Scene {
        return this.scene;
    }

    public getSky() : Mesh {
        if (this.sky) {
            return this.sky.getInstance();
        }
        return null;
    }

    public getFloor() : Mesh {
        if (this.floor) {
            return this.floor.getInstance();
        }
        return null;
    }
    
    public addBall() : void {
        this.ball = new ModelBall({
            radius: 5,
            weight: 0.01,
            polygonsQuantity: 64,
            position: {
                x: 0,
                y: 100,
                z: 25
            }
        })
        this.physics.getWorld().addBody(this.ball.getBody()) 
        this.scene.add(this.ball.getMesh())
    }

    public addPoles() : void {
        const poles = createPoles();
        poles.forEach(pole => {
            this.scene.add(pole.getMesh())
        })
    }

    // For example only
    public addBoxes() : void {
        const boxes = generateBoxes()
        this.boxes = boxes || []
        for (let i = 0; i < this.boxes.length; i++) {
            this.physics.getWorld().addBody(this.boxes[i].getBody()) 
            this.scene.add(this.boxes[i].getMesh())
        }
    }    

    public animate(socket? : any) {
        this.animateBall();
        // this.animateBoxes();

        let i = 0;
    }
    
    public animateBall() : void {
        this.ball.synchronize()
    }

    public animateBoxes() {
        for (let i = 0; i < this.boxes.length; i++) {
            this.boxes[i].synchronize()            
        }
    }
}

export { GameScene }