// @flow

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
    scene: Scene;
    sky: Sky;
    fog: Fog;
    floor: Floor;
    physics: Physics;
    lights: {
        ambient: Ambient,
        // directional: Directional
    }
    ball : ModelBall;
    socket : any;
    // --- For example only ---
    boxes : Array<ModelBox>;
    // ------------------------

    getBall () : ModelBall {
        return this.ball;
    }

    setPhysics(physics: Physics) : void {
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

    setSocket (socket: any) : void {
        this.socket = socket;
    }

    initFog() : void {
        this.fog = new Fog(0xcce0ff, 500, 1000)
    }

    initScene() : void {
        this.scene = new Scene();
        this.sky = new Sky();
        this.floor = new Floor();
    }
    
    initLights() : void {
        this.lights = {
            ambient: new Ambient(),
            // directional: new Directional()
        }

        this.scene.add(this.lights.ambient.getInstance());
        // this.scene.add(this.lights.directional.getInstance()); // TODO: For sun shadows
    }

    fillScene() : void {
        this.scene.add(this.getSky());
        this.scene.add(this.getFloor());
    }


    getScene() : Scene {
        return this.scene;
    }

    getSky() : Mesh {
        if (this.sky) {
            return this.sky.getInstance();
        }
        return null;
    }

    getFloor() : Mesh {
        if (this.floor) {
            return this.floor.getInstance();
        }
        return null;
    }
    
    addBall() : void {
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

    addPoles() : void {
        const poles = createPoles();
        poles.forEach(pole => {
            this.scene.add(pole.getMesh())
        })
    }

    // For example only
    addBoxes() : void {
        const boxes = generateBoxes()
        this.boxes = boxes || []
        for (let i = 0; i < this.boxes.length; i++) {
            this.physics.getWorld().addBody(this.boxes[i].getBody()) 
            this.scene.add(this.boxes[i].getMesh())
        }
    }    

    animate(socket? : any) {
        this.animateBall();
        // this.animateBoxes();

        let i = 0;
    }
    
    animateBall() : void {
        this.ball.synchronize()
    }

    animateBoxes() {
        for (let i = 0; i < this.boxes.length; i++) {
            this.boxes[i].synchronize()            
        }
    }
}

export { GameScene }