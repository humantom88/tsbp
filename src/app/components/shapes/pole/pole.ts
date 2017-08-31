import { BoxGeometry, MeshPhongMaterial, Mesh, Vector3, Quaternion } from 'three'
import { Vec3, Box, Shape, Body } from 'cannon'
import { Syncronizable } from '../interfaces'

class Pole implements Syncronizable {
    private halfExtents : Vec3
    private poleGeo : BoxGeometry;
    private poleMat : MeshPhongMaterial;
    private shape : Shape;
    private mesh : Mesh;
    private body : Body;

    public getMesh() : Mesh {
        return this.mesh
    }

    public getBody() : Body {
        return this.body
    }

    constructor(width: number, height: number, depth: number, x: number, y: number) {
        this.poleGeo = new BoxGeometry( width, height, depth );
        this.poleMat = new MeshPhongMaterial({ color: 0xffffff, specular: 0x111111, shininess: 100 });
        this.initMesh(x, y);
        this.initPhysics();
        this.synchronize();
    }

    public synchronize() : void {
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

    private initPhysics() : void {
        this.halfExtents = new Vec3(1, 1, 1)
        this.shape = new Box(this.halfExtents)
        this.body = new Body({ mass: 10000 })
        this.body.addShape(this.shape)
    }

    private initMesh(x : number, y : number) {
        this.mesh = new Mesh( this.poleGeo, this.poleMat );
        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.receiveShadow = true;
        this.mesh.castShadow = true;
    }
}

function createPoles () : Array<Pole> {
    const poles : Array<Pole> = []

    poles.push(new Pole(1, 75 , 1, -25, - 12))
    poles.push(new Pole(1, 75, 1, 25, -12))
    poles.push(new Pole(51, 1, 1, 0, - 50 + (150 / 2)))
    poles.push(new Pole(2, 2, 2, 25, -50))
    poles.push(new Pole(2, 2, 2, -25, -50))

    return poles
}

export { Pole, createPoles }