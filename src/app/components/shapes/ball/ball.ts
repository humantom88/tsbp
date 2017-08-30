import { Mesh, Texture, Material,
    SphereGeometry, MeshLambertMaterial,
    TextureLoader, RepeatWrapping,
    DoubleSide, Vector3 } from 'three'
import { Vec3, Sphere, Body } from 'cannon'

const image = require('./images/ball.jpg')

class Ball {
    private vector : Vec3;
    private ballShape : Sphere;
    private ballGeometry : SphereGeometry;
    private ballBody : Body;
    private ballMesh: Mesh;
    private material : Material;
    private map : Texture;

    public setMaterial(material : Material) {
        this.material = material
    }

    public setPosition(x : number, y : number, z : number) : void {
        this.ballBody.position = new Vec3(x, y, z);
        this.ballMesh.position = new Vector3(x, y, z);
    }

    public getBody() : Body {
        return this.ballBody
    }

    public getMesh() : Mesh {
        return this.ballMesh
    }
    
    public getShape = () => {
        return this.ballShape
    }

    public getBall = () => ({
        body: this.ballBody,
        mesh: this.ballMesh,
        shape: this.ballShape
    })

    constructor(options: {
        radius : number,
        weight : number,
        polygonsQuantity : number,
        color? : string,
        position?: {
            x: number,
            y: number,
            z: number
        }
    }) {
        const { radius, polygonsQuantity, weight, position, color } = options;
        this.ballShape = new Sphere(radius)
        this.ballGeometry = new SphereGeometry(this.ballShape.radius, polygonsQuantity, polygonsQuantity )
        this.ballBody = new Body({ mass: weight })
        this.ballBody.addShape(this.ballShape)

        if (color) {
            this.initColoredMaterial(color)
        } else {
            this.initTexturedMaterial()
        }
       
        this.initMesh()

        this.ballBody.position.set(position.x || 0, position.y || 10, position.z || 10);
    }

    private initMesh() {
        this.ballMesh = new Mesh(this.ballGeometry, this.material)
        this.ballMesh.castShadow = true
        this.ballMesh.receiveShadow = true
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

export { Ball }