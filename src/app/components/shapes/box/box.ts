import { Vec3, Box as CannonBox, Body } from "cannon"
import { Color, BoxGeometry, MeshLambertMaterial, Mesh, Material,
    Texture, TextureLoader, RepeatWrapping, DoubleSide } from "three"

const image = require('./images/box.jpg')

class Box {
    private halfExtents : Vec3;
    private boxShape : CannonBox;
    private boxGeometry : BoxGeometry;
    private boxBody : Body;
    private boxMesh: Mesh;
    private material : Material;
    private map : Texture;

    public setMaterial(material : Material) {
        this.material = material
    }

    public setPosition(x : number, y : number, z : number) : void {
        this.boxBody.position.set(x, y, z)
        this.boxMesh.position.set(x, y, z)
    }

    public getBox() : Body {
        return this.boxBody
    }

    public getBoxMesh() : Mesh {
        return this.boxMesh
    }

    constructor(x : number, y : number, z : number, color? : string) {
        this.halfExtents = new Vec3(1, 1, 1)
        this.boxShape = new CannonBox(this.halfExtents)
        this.boxGeometry = new BoxGeometry(
            this.halfExtents.x * 2,
            this.halfExtents.y * 2,
            this.halfExtents.z * 2
        )
        this.boxBody = new Body({ mass: 5 })
        this.boxBody.addShape(this.boxShape)

        if (color) {
            this.initColoredMaterial(color)
        } else {
            this.initTexturedMaterial()
        }
       
        this.initMesh()
    }

    private initMesh() {
        this.boxMesh = new Mesh(this.boxGeometry, this.material)
        this.boxMesh.castShadow = true
        this.boxMesh.receiveShadow = true
    }

    private initColoredMaterial(color : string) {
        this.material = new MeshLambertMaterial({ color })
    }

    private initTexturedMaterial () {
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
}

export { Box }