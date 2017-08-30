import { BoxGeometry, MeshPhongMaterial, Mesh } from 'three'

class Pole {
    private poleGeo : BoxGeometry;
    private poleMat : MeshPhongMaterial;
    private mesh : Mesh;

    constructor(width: number, height: number, depth: number, x: number, y: number) {
        this.poleGeo = new BoxGeometry( width, height, depth );
        this.poleMat = new MeshPhongMaterial({ color: 0xffffff, specular: 0x111111, shininess: 100 });
        this.initMesh(x, y);
    }

    private initMesh(x : number, y : number) {
        this.mesh = new Mesh( this.poleGeo, this.poleMat );
        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.receiveShadow = true;
        this.mesh.castShadow = true;
    }
    
    public getInstance () : Mesh {
        return this.mesh
    }
}

function createPoles () : Array<Mesh> {
    const poles : Array<Mesh> = []
    poles.push(new Pole(1, 75 , 1, -25, - 12).getInstance())
    poles.push(new Pole(1, 75, 1, 25, -12).getInstance())
    poles.push(new Pole(51, 1, 1, 0, - 50 + (150 / 2)).getInstance())
    poles.push(new Pole(2, 2, 2, 25, -50).getInstance())
    poles.push(new Pole(2, 2, 2, -25, -50).getInstance())

    // poles.push(new Pole(5, 375, 5, -125, -62).getInstance())
    // poles.push(new Pole(5, 375, 5, 125, -62).getInstance())
    // poles.push(new Pole(255, 5, 5, 0, -250 + (750 / 2)).getInstance())
    // poles.push(new Pole(10, 10, 10, 125, -250).getInstance())
    // poles.push(new Pole(10, 10, 10, -125, -250).getInstance())

    return poles
}

export { Pole, createPoles }