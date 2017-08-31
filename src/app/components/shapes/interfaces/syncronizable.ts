import { Mesh, Geometry } from 'three';
import { Body, Shape } from 'cannon';

interface Syncronizable {
    synchronize() : void;
    getMesh() : Mesh;
    getBody() : Body; 
}

export { Syncronizable }