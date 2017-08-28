import { Camera, PerspectiveCamera, WebGLRenderer, PCFSoftShadowMap, Scene } from 'three';
import { Physics } from './components/physics';
import { PointerLock } from './components/controls';
import { GameScene } from './components/scenes/game-scene';

interface Runnable {
    run() : void;
}

class App implements Runnable {
    private title: string;
    private scene: GameScene;
    private camera: Camera;
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

    public getScene(): Scene {
        return this.scene.getScene()
    }

    public constructor(title: string) {
        this.title = title;
        this.initScene();
        this.initCamera();
        this.initPhysics();
        this.initControls();
        this.initRenderer();
    }

    private initPhysics() {
        this.physics = new Physics();
    }

    private initScene = () : void => {
        this.scene = new GameScene();
    }

    private initCamera = () : void => {
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        // this.camera.lookAt(this.scene.getScene().position);
    }

    public getCamera () : Camera {
        return this.camera
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
            // for (let i = 0; i < this.boxes.length; i++) {
            //     this.boxMeshes[i].position.copy(this.boxes[i].position)
            //     this.boxMeshes[i].quaternion.copy(this.boxes[i].quaternion)
            // }
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