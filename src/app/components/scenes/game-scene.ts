import { Scene, Light, Object3D, Mesh, Vector3, Quaternion } from 'three'
import { Box as ModelBox } from '../shapes/box'
import { Ball as ModelBall } from '../shapes/ball'
import { Body } from 'cannon'
import { Physics } from '../physics'
import { Ambient, Directional } from '../lights'
import { Sky } from '../skies/sky'
import { Floor } from '../terrains/floor'

class GameScene {
    private scene: Scene;
    private sky: Sky;
    private floor: Floor;
    private physics: Physics;
    private lights: {
        ambient: Ambient,
        // directional: Directional
    }
    private ball : Body
    private ballMesh : Mesh
    // --- For example only ---
    private boxes : Array<Body>
    private boxMeshes : Array<Mesh>
    // ------------------------

    public setPhysics(physics: Physics) : void {
        this.physics = physics
    }

    constructor(physics: Physics) {
        this.initScene()
        this.fillScene()
        this.initLights()
        this.setPhysics(physics)
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
        const ball = new ModelBall({
            radius: 0.4,
            weight: 0.1,
            polygonsQuantity: 64,
            position: {
                x: 10, y: 0, z: 0
            }
        })

        this.ball = ball.getBody()
        this.ballMesh = ball.getMesh()
        this.physics.getWorld().addBody(this.ball) 
        this.scene.add(this.ballMesh)
    }

    public animateBall() : void {
        this.ballMesh.position.copy(
            new Vector3(
                this.ball.position.x,
                this.ball.position.y,
                this.ball.position.z
            )
        )
        this.ballMesh.quaternion.copy(
            new Quaternion(
                this.ball.quaternion.x,
                this.ball.quaternion.y,
                this.ball.quaternion.z,
                this.ball.quaternion.w
            )
        )
    }

    // For example only
    public addBoxes() : void {
        const { boxes, boxMeshes } = this.generateBoxes()
        this.boxes = boxes || []
        this.boxMeshes = boxMeshes || []
        for (let i = 0; i < this.boxes.length; i++) {
            this.physics.getWorld().addBody(this.boxes[i]) 
            this.scene.add(this.boxMeshes[i])
        }
    }

    // For example only
    public generateBoxes(
        boxCount : number = 200,
        posX : number = 0,
        posY : number = 50,
        posZ : number = -100
    ) : {
        boxes: Array<Body>,
        boxMeshes: Array<Mesh>
    } {
        const boxes = []
        const boxMeshes = []
        for (let i = 0; i < boxCount; i++) {
            let x = (Math.random() - 0.5) * 20
            let y = 1 + (Math.random() - 0.5) * 1
            let z = (Math.random() - 0.5) * 20
    
            let color = "#" + ((Math.random() * 0xffffff) << 0).toString(16)
    
            // let box = new ModelBox(x, y, z, color)
            let box = new ModelBox(x, y, z)
    
            box.setPosition(x + posX, y + posY, z + posZ)
    
            boxes.push(box.getBox())
            boxMeshes.push(box.getBoxMesh())
        }
        return { boxes, boxMeshes }
    }

    public animate() {
        this.animateBall();
    }

    public animateBoxes() {
        for (let i = 0; i < this.boxes.length; i++) {
            this.boxMeshes[i].position.copy(
                new Vector3(this.boxes[i].position.x, this.boxes[i].position.y, this.boxes[i].position.z)
            )
                
            this.boxMeshes[i].quaternion.copy(
                new Quaternion(this.boxes[i].quaternion.x, this.boxes[i].quaternion.y, this.boxes[i].quaternion.z, this.boxes[i].quaternion.w)
            )
            
        }
    }
}

export { GameScene }