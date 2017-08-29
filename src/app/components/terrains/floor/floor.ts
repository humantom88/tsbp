import { TextureLoader, Texture, MeshPhongMaterial,
    RepeatWrapping, Vector2, PlaneBufferGeometry,
    Mesh, FlatShading } from 'three'

const image = require('./images/sand.jpg')

class Floor {
    private floorTexture: Texture;
    private floorMaterial: MeshPhongMaterial;
    private geometry: PlaneBufferGeometry;
    private floor: Mesh;

    constructor() {
        this.initFloorTexture();
        this.initFloorMaterial();
        this.geometry = new PlaneBufferGeometry(1000, 1000)
        this.initFloor()
    }

    private initFloor() : void {
        this.floor = new Mesh(this.geometry, this.floorMaterial)
        this.floor.rotation.x = -0.5 * Math.PI
        this.floor.position.y = 0
        this.floor.castShadow = true
        this.floor.receiveShadow = true
    }

    private initFloorTexture() : void {
        this.floorTexture = new TextureLoader().load(image)
        this.floorTexture.wrapS = RepeatWrapping
        this.floorTexture.wrapT = RepeatWrapping
        this.floorTexture.repeat = new Vector2(50, 50)
    }

    public initFloorMaterial() : void {
        this.floorMaterial = new MeshPhongMaterial({
            color: 0xffffff,
            specular: 0xffffff,
            shininess: 20,
            shading: FlatShading,
            map: this.floorTexture || null
        })
    }

    public getInstance() : Mesh {
        return this.floor;
    }
}

export { Floor }