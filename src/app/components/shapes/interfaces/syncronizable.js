// @flow
import { Mesh, Geometry } from 'three';
import { Body, Shape } from 'cannon';

export interface Syncronizable {
    synchronize() : void;
    getMesh() : Mesh;
    getBody() : Body; 
}
