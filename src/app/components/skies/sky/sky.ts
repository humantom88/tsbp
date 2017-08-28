import { SphereGeometry, Vector2, Mesh,
    BackSide, TextureLoader, Texture,
    MeshPhongMaterial, RepeatWrapping } from 'three';

const skyImage = require('./texture/sky_texture1984.jpg');

class Sky {
    private skySphere: SphereGeometry;
    private texture: Texture;
    private material: MeshPhongMaterial;
    private sky: Mesh;

    constructor() {
        this.skySphere = new SphereGeometry(200, 25, 25)
        this.texture = new TextureLoader().load(skyImage)
        this.texture.wrapS = RepeatWrapping
        this.texture.wrapT = RepeatWrapping
        this.texture.repeat = new Vector2(5, 5)
        this.material = new MeshPhongMaterial({
            map: this.texture
        })

        this.sky = new Mesh(this.skySphere, this.material)
        this.sky.material.side = BackSide
    }

    getInstance() {
        return this.sky;
    }
}

export { Sky }
