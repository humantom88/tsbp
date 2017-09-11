import { Camera, WebGLRenderer, PCFSoftShadowMap, Scene } from 'three';
import { Physics } from './components/physics';
import { Perspective, Orthographic } from './components/cameras';
import { PointerLock } from './components/controls';
import { GameScene } from './components/scenes/game-scene';
import { StereoEffect } from './components/effects';
import { Config } from './config';

const isVR = false
const isServerClient = false

interface Runnable {
    run() : void;
}

class App implements Runnable {
    private title: string;
    private config: Config;
    private scene: GameScene;
    private camera: Perspective | Orthographic;
    private controls: PointerLock;
    private renderer: WebGLRenderer;
    private effect: StereoEffect;
    private physics: Physics;
    private dt : number = 1 / 60;
    private time = Date.now();
    private socket?: any;

    public getTime() : number {
        return this.time
    }

    public setTime(time : number) : void {
        this.time = time
    }

    public getScene() : Scene {
        return this.scene.getScene() // TODO: Dependency Injection
    }

    public constructor(title: string, config: Config, socket?: any) {
        this.title = title;
        this.config = config;
        this.initSocket(socket);
        this.initPhysics();
        this.initScene(this.physics);
        this.initCamera();        
        this.initControls();
        this.initRenderer();
        this.initSocketListeners();
    }

    private initSocket(socket : any) : void {
        if (this.config.isServerClient && socket) {
            this.socket = socket;
        }
    }

    private initSocketListeners() : void {
        if (this.config.isServerClient && this.socket) {
            this.socket.on(
                'updateBallCoordinates',
                (coordinates: any) => {
                    console.log('got coords')
                    if (coordinates) {
                        this.scene.getBall().updateBodyCoordinates(coordinates);
                    }
                }
            )
        }
    }

    private initPhysics() {
        this.physics = new Physics();
    }

    private initScene = (physics : Physics) : void => {
        this.scene = new GameScene(physics, this.socket);
        this.scene.addBall();
        this.scene.addPoles();
        // this.scene.addBoxes();
    }

    private initCamera = () : void => {
        this.camera = new Perspective();
    }

    public getCamera () : Camera {
        return this.camera.getInstance()
    }

    private initControls = () : void => {
        this.controls = new PointerLock(this.getCamera(), this.physics.getBody())
        if (this.socket) {
            this.controls.getCannonBody().addEventListener('collide', (e: any) => {
                if (e.contact.bi.id === this.controls.getCannonBody().id &&
                    e.contact.bj.id === this.scene.getBall().getBody().id
                ) {
                    this.socket.emit('ballTouched', {
                        position: this.scene.getBall().getBody().position,
                        velocity: this.scene.getBall().getBody().velocity,
                        quaternion: this.scene.getBall().getBody().quaternion,
                        angularVelocity: this.scene.getBall().getBody().angularVelocity
                    })
                }
            })
        }        
        this.scene.getScene().add(this.controls.getYawObject())
    }

    private initRenderer = () : void => {
        this.renderer = new WebGLRenderer();
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = PCFSoftShadowMap;
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        if (this.config.isVR) {
            this.effect = new StereoEffect(this.renderer);
            document.body.appendChild(this.effect.getRenderer().domElement)
        } else {
            document.body.appendChild(this.renderer.domElement);
        }
    }

    private render = () : void => {
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

        if (this.config.isVR) {
            this.effect.render(
                this.scene.getScene(),
                this.getCamera()
            );
        } else {
            this.renderer.render(
                this.scene.getScene(),
                this.getCamera()
            );
        }

        this.setTime(Date.now());
    }

    public run = () : void => {
        this.render()
    }

}

export { App };