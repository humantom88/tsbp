// @flow
import { Object3D, Quaternion, Camera, Vector3, Euler } from 'three'
import _ from 'lodash';
import { Vec3, Body } from 'cannon'

const PI_2 = Math.PI / 2

class PointerLock {
    camera: Camera;
    cannonBody: Body;
    // position
    eyeYPos: number;
    velocityFactor: number;
    jumpVelocity: number;
    
    pitchObject: Object3D;
    yawObject: Object3D;

    quat: Quaternion;

    // Movement Flags
    moveForward: boolean;
    moveBackward: boolean;
    moveLeft: boolean;
    moveRight: boolean;
    canJump: boolean;

    // Vectors
    contactNormal: Vec3;    // Cannon
    upAxis: Vec3;           // Cannon
    inputVelocity: Vector3; // Three

    euler: Euler;

    enabled: boolean;

    getEnabled() : boolean {
        return this.enabled
    }

    setEnabled(enabled: boolean) : void {
        this.enabled = enabled;
    }

    getUpAxis() : Vec3 {
        return this.upAxis
    }

    setCamera(camera: Camera) : void {
        this.camera = camera;
    }

    getCannonBody() : Body {
        return this.cannonBody
    }

    setCannonBody(cannonBody: Body) : void {
        this.cannonBody = cannonBody;
    }

    setContactNormal(contactNormal?: Vec3) : void{
        this.contactNormal = contactNormal || new Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
    }

    setUpAxis(upAxis?: Vec3) : void {
        this.upAxis = upAxis || new Vec3(0, 1, 0)
    }

    getYawObject() : Object3D {
        return this.yawObject;
    }

    getDirection(targetVec: Vec3) : void {
        targetVec.set(0, 0, -1)
        this.quat.multiplyVector3(targetVec)
    }

    constructor(camera: Camera, cannonBody: Body) {
        this.initPointerLock()
        this.initPosition()
        this.setCamera(camera)          // TODO: Dependency Injection
        this.initCannonBody(cannonBody) // TODO: Dependency Injection
        this.initPitchObject()
        this.initYawObject()
        this.initFlags()
        this.setContactNormal()
        this.setUpAxis()
        this.initEventListeners()
        this.setEnabled(false)
        this.quat = new Quaternion()

        // Moves the camera to the Cannon.js object position and adds velocity to the object if the run key is down
        this.initInputVelocity()
        this.initEuler()
    }

    initCannonBody(cannonBody: Body) {
        this.setCannonBody(cannonBody)
        this.cannonBody.addEventListener('collide', this.collide)
    }

    initInputVelocity() : void {
        if (!this.inputVelocity) {
            this.inputVelocity = new Vector3();
        }
    }

    initEuler() : void {
        if (!this.euler) {
            this.euler = new Euler();
        }
    }
    
    initEventListeners = () : void => {
        document.addEventListener('mousemove', this.onMouseMove, false)
        document.addEventListener('keydown', this.onKeyDown, false)
        document.addEventListener('keyup', this.onKeyUp, false)
    }

    initPosition() : void {
        this.eyeYPos = 2 // eyes are 2 meters above the ground
        this.velocityFactor = 0.3
        this.jumpVelocity = 75
    }

    initPitchObject() : void {
        this.pitchObject = new Object3D()
        this.pitchObject.add(this.camera)
    }

    initYawObject() : void {
        this.yawObject = new Object3D()
        this.yawObject.position.y = 2
        this.yawObject.add(this.pitchObject)
    }

    initFlags() : void {
        this.moveForward = false
        this.moveBackward = false
        this.moveLeft = false
        this.moveRight = false
        this.canJump = true
    }

    initPointerLock = () : void => {
        const blocker = document.getElementById('blocker')
        const instructions = document.getElementById('instructions')
    
        if (!instructions) { 
            return;
        }

        const havePointerLock = 'pointerLockElement' in document
            || 'mozPointerLockElement' in document
            || 'webkitPointerLockElement' in document
    
        if (havePointerLock) {
            const element = document.body;
    
            const pointerlockchange = (event: Event) => {
                if (document.pointerLockElement === element) {
                    this.setEnabled(true)
                    if (blocker && blocker.style) {
                        blocker.style.display = 'none';
                    }
                } else {
                    this.setEnabled(false)
                    if (blocker && blocker.style) {
                        blocker.style.display = '-webkit-box';
                        blocker.style.display = '-moz-box';
                        blocker.style.display = 'box';
                    }

                    instructions.style.display = ''
                }
            }
    
            const pointerlockerror = function (event: Event) {
                instructions.style.display = ''
            }
    
            // Hook pointer lock state change events
            document.addEventListener('pointerlockchange', pointerlockchange, false)
            document.addEventListener('mozpointerlockchange', pointerlockchange, false)
            document.addEventListener('webkitpointerlockchange', pointerlockchange, false)
    
            document.addEventListener('pointerlockerror', pointerlockerror, false)
            document.addEventListener('mozpointerlockerror', pointerlockerror, false)
            document.addEventListener('webkitpointerlockerror', pointerlockerror, false)
    
            instructions.addEventListener('click', function (event: Event) {
                instructions.style.display = 'none'
    
                // Ask the browser to lock the pointer

                // element.requestPointerLock = element.requestPointerLock // || element.mozRequestPointerLock || element.webkitRequestPointerLock
    
                if (/Firefox/i.test(navigator.userAgent)) {
    
                    const fullscreenchange = function (event: Event) {
    
                        if (document.fullscreenElement === element /*|| document.mozFullscreenElement === element || document.mozFullScreenElement === element*/) {
    
                            document.removeEventListener('fullscreenchange', fullscreenchange)
                            document.removeEventListener('mozfullscreenchange', fullscreenchange)
                            if (element) {
                                element.requestPointerLock()
                            }
                        }
    
                    }
    
                    document.addEventListener('fullscreenchange', fullscreenchange, false)
                    document.addEventListener('mozfullscreenchange', fullscreenchange, false)
    
                    // element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
                    if (element) {
                        element.requestFullscreen();
                    }
                } else {
                    if (element) {
                        element.requestPointerLock();
                    }
                }
            }, false)
    
        } else {
            instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API'
        }
    }

    onMouseMove = (event: MouseEvent) => {
        if (!this.getEnabled()) return

        let movementX = event.movementX // || event.mozMovementX || event.webkitMovementX || 0
        let movementY = event.movementY // || event.mozMovementY || event.webkitMovementY || 0

        this.yawObject.rotation.y -= movementX * 0.002
        this.pitchObject.rotation.x -= movementY * 0.002

        this.pitchObject.rotation.x = Math.max(- PI_2, Math.min(PI_2, this.pitchObject.rotation.x))
    }

    onKeyDown = (event: KeyboardEvent) => {
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                this.moveForward = true
                break
            case 37: // left
            case 65: // a
                this.moveLeft = true
                break
            case 40: // down
            case 83: // s
                this.moveBackward = true
                break
            case 39: // right
            case 68: // d
                this.moveRight = true
                break
            case 32: // space
                if (this.canJump === true) {
                    this.cannonBody.velocity.y = this.jumpVelocity
                }
                this.canJump = false
                break
        }
    };

    onKeyUp = (event: KeyboardEvent) => {
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                this.moveForward = false
                break
            case 37: // left
            case 65: // a
                this.moveLeft = false
                break
            case 40: // down
            case 83: // a
                this.moveBackward = false
                break
            case 39: // right
            case 68: // d
                this.moveRight = false
                break
        }
    }

    update = (delta : number) => {
        if (!this.getEnabled()) return

        delta *= 0.5

        this.inputVelocity.set(0, 0, 0)

        if (this.moveForward) {
            this.inputVelocity.z = -this.velocityFactor * delta
        }
        if (this.moveBackward) {
            this.inputVelocity.z = this.velocityFactor * delta
        }

        if (this.moveLeft) {
            this.inputVelocity.x = -this.velocityFactor * delta
        }
        if (this.moveRight) {
            this.inputVelocity.x = this.velocityFactor * delta
        }

        // Convert velocity to world coordinates
        this.euler.x = this.pitchObject.rotation.x
        this.euler.y = this.yawObject.rotation.y
        this.euler.order = "XYZ"
        this.quat.setFromEuler(this.euler)
        this.inputVelocity.applyQuaternion(this.quat)
        //quat.multiplyVector3(inputVelocity)

        // Add to the object
        this.cannonBody.velocity.x += this.inputVelocity.x
        this.cannonBody.velocity.z += this.inputVelocity.z

        this.copyYawPositionToCannonBody()
    }

    copyYawPositionToCannonBody() {
        this.yawObject.position.x = this.cannonBody.position.x;
        this.yawObject.position.y = this.cannonBody.position.y;
        this.yawObject.position.z = this.cannonBody.position.z;
    }

    collide = (e : any) => {
        const contact = e.contact

        // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
        // We do not yet know which one is which! Let's check.
        if (contact.bi.id == this.cannonBody.id) { // bi is the player body, flip the contact normal
            contact.ni.negate(this.contactNormal)
        } else {
            this.contactNormal.copy(contact.ni) // bi is something else. Keep the normal as it is
        }
        // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
        if (this.contactNormal.dot(this.getUpAxis()) > 0.5) { // Use a "good" threshold value between 0 and 1 here!
            this.canJump = true
        }
    }
}

export { PointerLock }