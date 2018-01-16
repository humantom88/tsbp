// @flow
import { Mesh, Texture, Material,
    SphereGeometry, MeshLambertMaterial,
    TextureLoader, RepeatWrapping,
    DoubleSide, Vector3, Quaternion } from 'three'
import { Vec3, Sphere, Body } from 'cannon'
import { Syncronizable } from '../interfaces'

const image = require('./images/ball.jpg')

class Ball implements Syncronizable {
    vector : Vec3;
    ballShape : Sphere;
    ballGeometry : SphereGeometry;
    body : Body;
    mesh: Mesh;
    material : Material;
    map : Texture;

    setMaterial(material : Material) {
        this.material = material
    }

    setPosition(x : number, y : number, z : number) : void {
        this.body.position = new Vec3(x, y, z);
        this.mesh.position = new Vector3(x, y, z);
    }

    getBody() : Body {
        return this.body
    }

    getMesh() : Mesh {
        return this.mesh
    }
    
    getShape = () => {
        return this.ballShape
    }

    getBall = () => ({
        body: this.body,
        mesh: this.mesh,
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
        this.body = new Body({ mass: weight })
        this.body.addShape(this.ballShape)

        if (color) {
            this.initColoredMaterial(color)
        } else {
            this.initTexturedMaterial()
        }
       
        this.initMesh()

        if (position) {
            const { x, y, z } = position;
            this.body.position.set(x || 0, y || 10, z || 10);
        }
    }

    initMesh() {
        this.mesh = new Mesh(this.ballGeometry, this.material)
        this.mesh.castShadow = true
        this.mesh.receiveShadow = true
    }

    initColoredMaterial(color : string) {
        this.material = new MeshLambertMaterial({ color })
    }

    initTexturedMaterial () {
        this.map = new TextureLoader().load(image);
        this.map.wrapS = RepeatWrapping
        this.map.wrapT = RepeatWrapping
        this.map.anisotropy = 16

        this.setMaterial(
            new MeshLambertMaterial({
                map: this.map,
                side: DoubleSide
            })
        )
    }

    updateBodyCoordinates (coordinates: any) : void {
        const { position, velocity, quaternion, angularVelocity } = coordinates;

        this.body.position.set(position.x, position.y, position.z);
        this.body.velocity.set(velocity.x, velocity.y, velocity.z);
        this.body.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
        this.body.angularVelocity.set(angularVelocity.x, angularVelocity.y, angularVelocity.z)
        this.synchronize()
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

export { Ball }