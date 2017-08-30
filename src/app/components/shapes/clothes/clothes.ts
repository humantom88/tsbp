import { TextureLoader, DoubleSide, Material, RepeatWrapping, Texture, MeshPhongMaterial, ParametricGeometry, ShaderMaterial } from 'three'

class Clothes {
    private texture : Texture;
    private material : Material;
    constructor() {
        this.initTexture()
        this.initMaterial()
    }

    private initTexture() : void {
        this.texture = new TextureLoader().load( './images/circuit_pattern.png' );
        this.texture.wrapS = this.texture.wrapT = RepeatWrapping;
        this.texture.anisotropy = 16;
    }

    private initMaterial() : void {
        this.material = new MeshPhongMaterial( {
            specular: 0x030303,
            map: this.texture,
            side: DoubleSide,
            alphaTest: 0.5
        } );
    }

    // cloth geometry
    // clothGeometry = new ParametricGeometry( clothFunction, cloth.w, cloth.h ); // Exapmle here: https://github.com/mrdoob/three.js/blob/master/examples/js/Cloth.js
    // clothGeometry.dynamic = true;
    // var uniforms = { texture:  { value: this.texture } };
    // var vertexShader = document.getElementById( 'vertexShaderDepth' ).textContent;
    // var fragmentShader = document.getElementById( 'fragmentShaderDepth' ).textContent;
    // // cloth mesh
    // object = new Mesh( clothGeometry, clothMaterial );
    // object.position.set( 0, 0, 0 );
    // object.castShadow = true;
    // scene.add( object );
    // object.customDepthMaterial = new ShaderMaterial( {
    //     uniforms: uniforms,
    //     vertexShader: vertexShader,
    //     fragmentShader: fragmentShader,
    //     side: THREE.DoubleSide
    // } );
}

export { Clothes }