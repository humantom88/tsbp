import { Mesh, Geometry } from 'three';
import { Body, Shape } from 'cannon';

interface Physicable {
    synchronize() : void;
    getMesh() : Mesh;
    getBody() : Body; 
}

export { Physicable }