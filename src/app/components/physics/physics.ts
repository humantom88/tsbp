import { World, GSSolver, SplitSolver, Vec3,
    Material, NaiveBroadphase, ContactMaterial,
    Sphere, Body, Plane } from 'cannon'

class Physics {
    private world: World;
    private solver: GSSolver;
    private isSplit: boolean;
    private sphereShape: Sphere;
    private sphereBody: Body;

    private setSplit(isSplit : boolean) : void {
        this.isSplit = isSplit;
    }

    private getSplit() : boolean {
        return this.isSplit;
    }
    
    private setWorld(world? : World) : void {
        this.world = world || new World();
    }

    private setSolver(solver? : GSSolver) : void {
        this.solver = solver || new GSSolver();
    }

    private getSolver() : GSSolver {
        return this.solver
    }

    private initWorld() : void {
        this.setWorld();
        this.world.quatNormalizeSkip = 0
        this.world.quatNormalizeFast = false
        this.world.defaultContactMaterial.contactEquationStiffness = 1e9
        this.world.defaultContactMaterial.contactEquationRelaxation = 4
        this.world.gravity.set(0, -20, 0)
        this.world.broadphase = new NaiveBroadphase()

        // Create a slippery material (friction coefficient = 0.0)
        let physicsMaterial
        physicsMaterial = new Material('slipperyMaterial')
        let physicsContactMaterial = new ContactMaterial(
            physicsMaterial,
            physicsMaterial, {
                friction: 0.0,
                restitution: 0.3
            }
        )
        // We must add the contact materials to the world
        this.world.addContactMaterial(physicsContactMaterial)

        // Create a plane
        let groundShape = new Plane()
        let groundBody = new Body({ mass: 0 })
        groundBody.addShape(groundShape)
        groundBody.quaternion.setFromAxisAngle(
            new Vec3(1, 0, 0),
            -Math.PI / 2
        )
        this.world.bodies.push(groundBody)
    }

    private initSphere() : void {
        let mass = 5, radius = 1.3
        this.sphereShape = new Sphere(radius)
        this.sphereBody = new Body({ mass: mass })
        this.sphereBody.addShape(this.sphereShape)
        this.sphereBody.position.set(0, 5, 0)
        this.sphereBody.linearDamping = 0.9
        this.world.bodies.push(this.sphereBody)
    }
    
    constructor() {
        this.initWorld();
        this.initSphere();
        this.initSolver();
    }

    public getWorld() : World {
        return this.world;
    }

    public getShape() : Sphere {
        return this.sphereShape;
    }

    public getBody() : Body {
        return this.sphereBody;
    }

    private initSolver() : void {
        this.setSolver()
        this.solver.iterations = 7
        this.solver.tolerance = 0.1
        
        this.setSplit(true);
        if (this.getSplit()) {
            this.world.solver = new SplitSolver(this.solver)
        } else {
            this.world.solver = this.solver
        }
    }

}

export { Physics }
