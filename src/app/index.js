// @flow
import { Camera, WebGLRenderer, PCFSoftShadowMap, Scene } from 'three';
import { Physics } from './components/physics';
import { Perspective, Orthographic } from './components/cameras'
import { PointerLock } from './components/controls';
import { GameScene } from './components/scenes/game-scene';
import { StereoEffect } from './components/effects';

const isVR = false

interface Runnable {
    run() : void;
}

export class App implements Runnable {
    title: string;
    scene: GameScene;
    camera: Perspective | Orthographic;
    controls: PointerLock;
    renderer: WebGLRenderer;
    effect: StereoEffect;
    physics: Physics;
    dt : number = 1 / 60;
    time = Date.now();
    socket: any;

    getTime() : number {
        return this.time
    }

    setTime(time : number) : void {
        this.time = time
    }

    getScene() : Scene {
        return this.scene.getScene() // TODO: Dependency Injection
    }

    constructor(title: string, socket: any) {
        this.title = title;
        this.initSocket(socket);
        this.initPhysics();
        this.initScene(this.physics);
        this.initCamera();        
        this.initControls();
        this.initRenderer();
        this.initSocketListeners();
    }

    initSocket(socket : any) : void {
        this.socket = socket;
    }

    initSocketListeners() : void {
        if (this.socket) {
            this.socket.on('updateBallCoordinates',
                (coordinates: any) => {
                    console.log('got coords')
                    if (coordinates) {
                        this.scene.getBall().updateBodyCoordinates(coordinates);
                    }
                }
            )
        }
    }

    initPhysics() {
        this.physics = new Physics();
    }

    initScene = (physics : Physics) : void => {
        this.scene = new GameScene(physics, this.socket);
        this.scene.addBall();
        this.scene.addPoles();
        // this.scene.addBoxes();
    }

    initCamera = () : void => {
        this.camera = new Perspective();
    }

    getCamera () : Camera {
        return this.camera.getInstance()
    }

    initControls = () : void => {
        this.controls = new PointerLock(this.getCamera(), this.physics.getBody())
        this.controls.getCannonBody().addEventListener('collide', (e: any) => {
            if (e.contact.bi.id === this.controls.getCannonBody().id &&
                e.contact.bj.id === this.scene.getBall().getBody().id
            ) {
                console.log(this.scene.getBall().getBody())
                this.socket.emit('ballTouched', {
                    position: this.scene.getBall().getBody().position,
                    velocity: this.scene.getBall().getBody().velocity,
                    quaternion: this.scene.getBall().getBody().quaternion,
                    angularVelocity: this.scene.getBall().getBody().angularVelocity
                })
            }
        })
        this.scene.getScene().add(this.controls.getYawObject())
    }

    initRenderer = () : void => {
        this.renderer = new WebGLRenderer();
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = PCFSoftShadowMap;
        this.renderer.setSize(window.innerWidth - 1, window.innerHeight - 3);

        if (isVR) {
            this.effect = new StereoEffect(this.renderer);
            
            if (document.body && this.effect.getRenderer().domElement !== null) {
                document.body.appendChild(this.effect.getRenderer().domElement);
            }
        } else {
            if (document.body && this.renderer !== null) {
                document.body.appendChild(this.renderer.domElement);
            }
        }
    }

    render = () : void => {
        requestAnimationFrame(this.render);
        //if (this.controls.getEnabled()) {
            this.physics.getWorld().step(this.dt)
            // Update ball positions
            // for (let i = 0; i < this.gun.getBallsLength(); i++) {
            //     this.gun.updateBall(i)
            // }

            // Update box positions
            this.scene.animate()
            // TWEEN.update()
        //}

        this.controls.update(Date.now() - this.getTime())

        if (isVR) {
            this.effect.render(this.scene.getScene(), this.getCamera());
        } else {
            this.renderer.render(this.scene.getScene(), this.getCamera());
        }

        this.setTime(Date.now());
    }

    run = () : void => {
        this.render()
    }

}
