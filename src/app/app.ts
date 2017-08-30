import { Camera, WebGLRenderer, PCFSoftShadowMap, Scene } from 'three';
import { Physics } from './components/physics';
import { Perspective, Orthographic } from './components/cameras'
import { PointerLock } from './components/controls';
import { GameScene } from './components/scenes/game-scene';

interface Runnable {
    run() : void;
}

class App implements Runnable {
    private title: string;
    private scene: GameScene;
    private camera: Perspective | Orthographic;
    private controls: PointerLock;
    private renderer: WebGLRenderer;
    private physics: Physics;
    private dt : number = 1 / 60;
    private time = Date.now();

    public getTime() : number {
        return this.time
    }

    public setTime(time : number) : void {
        this.time = time
    }

    public getScene() : Scene {
        return this.scene.getScene() // TODO: Dependency Injection
    }

    public constructor(title: string) {
        this.title = title;
        this.initPhysics();
        this.initScene(this.physics);
        this.initCamera();        
        this.initControls();
        this.initRenderer();
    }

    private initPhysics() {
        this.physics = new Physics();
    }

    private initScene = (physics : Physics) : void => {
        this.scene = new GameScene(physics);
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
        this.scene.getScene().add(this.controls.getYawObject())
    }

    private initRenderer = () : void => {
        this.renderer = new WebGLRenderer();
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = PCFSoftShadowMap;
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(this.renderer.domElement);
    }

    private render = () : void => {
        requestAnimationFrame(this.render);
        if (this.controls.getEnabled()) {
            this.physics.getWorld().step(this.dt)
            // Update ball positions
            // for (let i = 0; i < this.gun.getBallsLength(); i++) {
            //     this.gun.updateBall(i)
            // }

            // Update box positions
            this.scene.animate()
            // TWEEN.update()
        }

        this.controls.update(Date.now() - this.getTime())

        this.renderer.render(this.scene.getScene(), this.getCamera());

        this.setTime(Date.now());
    }

    public run = () : void => {
        this.render()
    }

}

export { App };