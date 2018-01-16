// @flow
import { Vec3, Box as CannonBox, Body } from "cannon"
import { Color, BoxGeometry, MeshLambertMaterial,
    Mesh, Material, Texture, TextureLoader,
    RepeatWrapping, DoubleSide, Vector3,
    Quaternion } from "three"
import { Syncronizable } from '../interfaces'
const image = require('./images/box.jpg')

class Box implements Syncronizable {
    halfExtents : Vec3;
    boxShape : CannonBox;
    boxGeometry : BoxGeometry;
    body : Body;
    mesh: Mesh;
    material : Material;
    map : Texture;

    setMaterial(material : Material) {
        this.material = material
    }

    setPosition(x : number, y : number, z : number) : void {
        this.body.position.set(x, y, z)
        this.mesh.position.set(x, y, z)
    }

    getBody() : Body {
        return this.body
    }

    getMesh() : Mesh {
        return this.mesh
    }

    constructor(x : number, y : number, z : number, color? : string) {
        this.halfExtents = new Vec3(1, 1, 1)
        this.boxShape = new CannonBox(this.halfExtents)
        this.boxGeometry = new BoxGeometry(
            this.halfExtents.x * 2,
            this.halfExtents.y * 2,
            this.halfExtents.z * 2
        )
        this.body = new Body({ mass: 5 })
        this.body.addShape(this.boxShape)

        if (color) {
            this.initColoredMaterial(color)
        } else {
            this.initTexturedMaterial()
        }
       
        this.initMesh()
    }

    initMesh() {
        this.mesh = new Mesh(this.boxGeometry, this.material)
        this.mesh.castShadow = true
        this.mesh.receiveShadow = true
    }

    initColoredMaterial(color : string) {
        this.material = new MeshLambertMaterial({ color })
    }

    initTexturedMaterial () {
        this.map = new TextureLoader().load(image);
        this.map.wrapS = this.map.wrapT = RepeatWrapping
        this.map.anisotropy = 16

        this.setMaterial(
            new MeshLambertMaterial({
                map: this.map,
                side: DoubleSide
            })
        )
    }

    synchronize() : void {
        this.mesh.position.copy(
            new Vector3(
                this.body.position.x,
                this.body.position.y,
                this.body.position.z
            )
        )
        this.mesh.quaternion.copy(
            new Quaternion(
                this.body.quaternion.x,
                this.body.quaternion.y,
                this.body.quaternion.z,
                this.body.quaternion.w
            )
        )
    }
}

// For example only
function generateBoxes(
    boxCount : number = 200,
    posX : number = 0,
    posY : number = 50,
    posZ : number = -100
) : Array<Box> {
    const boxes = []
    for (let i = 0; i < boxCount; i++) {
        let x = (Math.random() - 0.5) * 20
        let y = 1 + (Math.random() - 0.5) * 1
        let z = (Math.random() - 0.5) * 20

        let color = "#" + ((Math.random() * 0xffffff) << 0).toString(16)

        // let box = new ModelBox(x, y, z, color)
        let box = new Box(x, y, z)

        box.setPosition(x + posX, y + posY, z + posZ)

        boxes.push(box)
    }
    return boxes
}

export { Box, generateBoxes }