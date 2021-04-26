import * as THREE from 'three';
import { COLOR } from './const';
import { Bull, Ghost, Hero, Humanoid, Mob, Reaper, Zombie } from './humanoid';
import { createBrownFloorTile, createDeepBrownFloorTile } from './models/floor';
import { PROPS, Props } from './props';

const DIRS = [new THREE.Vector2(-1, 0), new THREE.Vector2(1, 0), new THREE.Vector2(0, 1), new THREE.Vector2(0, -1)];

export class Game {
  public container!: HTMLElement;
  public camera: THREE.OrthographicCamera = new THREE.OrthographicCamera(1, 1, 1, 1);
  public renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  public scene: THREE.Scene = new THREE.Scene();

  public hero!: Humanoid;
  public minZ = 0;
  public maxZ = 0;
  public score = 0;
  public heroTurn = true;
  public mobsTurn = false;
  public lastKilledBy = 'mob';
  public clock = new THREE.Clock();

  public mobs: Mob[] = [];

  public props: Props[] = [];
  public floors: THREE.Object3D[] = [];

  public get heroAlive(): boolean {
    return this.hero?.isAlive;
  }

  public init(container: HTMLElement): void {
    this.container = container;
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.scene.fog = new THREE.Fog(COLOR.darkpurple, 0, 90);

    this.camera.matrixAutoUpdate = true;
    this.camera.position.set(0.5, 1, 1);
    this.camera.lookAt(0, 0, 0);

    this.renderer.setSize(width, height, true);
    this.renderer.shadowMap.enabled = true;

    container.appendChild(this.renderer.domElement);
    this.resize();

    this.initScene();
  }

  public initScene(): void {
    this.scene.clear();
    this.createLights();
    this.floors = this.createFloor();

    this.score = 0;
    this.minZ = 0;
    this.maxZ = 0;
    this.heroTurn = true;

    const mesh = new Props(0, new THREE.Vector2(0, 1));
    mesh.addTo(this.scene);
    const mesh2 = new Props(4, new THREE.Vector2(3, 3));
    mesh2.addTo(this.scene);

    this.props = [mesh, mesh2];

    this.hero = new Hero();
    this.hero.addTo(this.scene);

    this.mobs = [];
    this.generateContent(4, 8, 3, 3);
    this.generateContent(9, 15, 3, 6);

    this.clock = new THREE.Clock();
  }

  public resize(): void {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    const aspectRatio = width / height;
    const d = 20 * (aspectRatio > 1 ? 2.5 : 3.5);
    const z = 100;
    this.camera.left = -d * aspectRatio;
    this.camera.right = d * aspectRatio;
    this.camera.top = d;
    this.camera.bottom = -d;
    this.camera.near = -z;
    this.camera.far = z;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private createLights(): void {
    const globalLight = new THREE.AmbientLight(0x39314b, .3);
    const shadowLight = new THREE.DirectionalLight(0xffffff, 1);
    shadowLight.position.set(-1, 1, 1);
    shadowLight.castShadow = true;
    shadowLight.shadow.camera.left = -40;
    shadowLight.shadow.camera.right = 40;
    shadowLight.shadow.camera.top = 40;
    shadowLight.shadow.camera.bottom = -40;
    shadowLight.shadow.camera.near = -100;
    shadowLight.shadow.camera.far = 100;
    shadowLight.shadow.mapSize.width = shadowLight.shadow.mapSize.height = 2048;
    shadowLight.shadow.radius = 20;
    shadowLight.shadow.bias = - 0.0001;
    this.scene.add(globalLight);
    this.scene.add(shadowLight);

    const hemiLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.6);
    this.scene.add(hemiLight);
  }

  private createFloor(): THREE.Object3D[] {
    const floorRows: THREE.Object3D[] = [];
    for (let i = 0; i <= 30; ++i) {
      const row = new THREE.Group();
      row.position.z = -i * 10;
      for (let j = -4; j <= 4; ++j) {
        const mesh = (i + j) % 2 ? createDeepBrownFloorTile() : createBrownFloorTile();
        mesh.position.x = j * 10;
        row.add(mesh);
      }
      floorRows.push(row);
      this.scene.add(row);
    }
    return floorRows;
  }

  private generateContent(znear: number, zrange: number, minMobs: number, mobVar: number): void {
    const items: Record<number, boolean> = {};
    const mobCount = minMobs + (Math.random() * mobVar) | 0;
    let firstEncounter = true;
    for (let i = 0; i < mobCount; ++i) {
      const type = Math.random() * 3;
      let x, y;
      do {
        x = ((Math.random() * 9) | 0) - 4;
        y = znear + ((Math.random() * zrange) | 0);
      } while (items[(y*9+x)|0]);

      let mob: Mob;
      if (
        (znear >= 120 && type > (3 - Math.min(0.2, znear/1000) - Math.min(0.1, this.clock.getElapsedTime() / 3600)))
      ) {
        mob = new Reaper(new THREE.Vector2(x, y), new THREE.Vector2(0, -1));
      } else if (
        (firstEncounter && znear === 60) ||
        (znear >= 60 && type > (2.8 - Math.min(0.3, znear/600) - Math.min(0.2, this.clock.getElapsedTime() / 1800)))
      ) {
        mob = new Bull(new THREE.Vector2(x, y), new THREE.Vector2(0, -1));
        firstEncounter = false;
      } else if (
        (firstEncounter && znear === 20) ||
        (znear >= 20 && type > (2.5 - Math.min(0.5, znear/500) - Math.min(0.2, this.clock.getElapsedTime() / 1200)))
      ) {
        mob = new Ghost(new THREE.Vector2(x, y), new THREE.Vector2(0, -1));
        firstEncounter = false;
      } else {
        mob = new Zombie(new THREE.Vector2(x, y), new THREE.Vector2(0, -1));
      }
      mob.addTo(this.scene);
      this.mobs.push(mob);
      items[(y*9+x)|0] = true;
    }

    const propsCount = ((minMobs + (Math.random() * mobVar)) * .7) | 0;
    for (let i = 0; i < propsCount; ++i) {
      const type = (Math.random() * PROPS.length)|0;
      let x, y;
      do {
        x = ((Math.random() * 9) | 0) - 4;
        y = znear + ((Math.random() * zrange) | 0);
      } while (items[(y*9+x)|0]);

      const dir = (Math.random() * 4)|0;
      const props = new Props(type, new THREE.Vector2(x, y), DIRS[dir].clone());
      props.addTo(this.scene);
      this.props.push(props);
      items[(y*9+x)|0] = true;
    }
  }

  private removeContent(): void {
    for (let i = 0; i < this.props.length; ++i) {
      if (this.props[i].position.y < this.minZ) {
        this.props[i].detach();
        this.props[i] = this.props[this.props.length - 1];
        this.props.pop();
      }
    }

    for (let i = 0; i < this.mobs.length; ++i) {
      if (this.mobs[i].position.y < this.minZ) {
        this.mobs[i].detach();
        this.mobs[i] = this.mobs[this.mobs.length - 1];
        this.mobs.pop();
      }
    }
  }

  public loop(callback?: () => void): void {
    if (this.hero) {
      this.camera.position.set(0.3, 1, 1 + this.hero.mesh.mesh.position.z);
      this.camera.lookAt(0, 0, this.hero.mesh.mesh.position.z);

      this.score = Math.max(this.score, this.hero.position.y - 2);

      if (this.score >= this.maxZ + 10) {
        this.minZ = this.maxZ - 5;
        this.maxZ += 20;
        this.removeContent();
        this.generateContent(this.maxZ, 20, 7 + (this.score/60)|0, 12 + (this.score/40)|0);
      }
    }

    if (this.mobsTurn && this.heroAlive) {
      this.moveMobs();
      this.mobsTurn = false;
    }

    this.render();
    callback?.();

    requestAnimationFrame(() => this.loop(callback));
  }

  public render(): void {
    if (this.hero) {
      const z = this.hero.position.y;
      const start = Math.max(this.minZ, ((z - 10) >> 1) * 2);
      for (let i = 0; i < this.floors.length; ++i) {
        this.floors[i].position.z = -(start + i) * 10;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  public move(dir: THREE.Vector2): void {
    if (!this.heroTurn || !this.heroAlive || this.hero.isMoving) return;

    const targetPos = dir.clone().add(this.hero.position);
    if (targetPos.x < -4 || targetPos.x > 4 || targetPos.y < this.minZ) return;

    for (const props of this.props) {
      if (props.position.equals(targetPos)) return;
    }

    for (let i = 0; i < this.mobs.length; ++i) {
      const mob = this.mobs[i];
      if (mob.position.equals(targetPos)) {
        this.hero.attack(dir, () => {
          mob.die(dir, ((i) => () => {
            this.mobs[i].detach();
            this.mobs[i] = this.mobs[this.mobs.length - 1];
            this.mobs.pop();
            this.heroTurn = false;        
            this.mobsTurn = true;
          })(i));
        });
        return;
      }
    }

    this.hero.move(dir, () => {
      this.heroTurn = false;  
      this.mobsTurn = true;
    });
  }

  private moveMobs(): void {
    let count = this.mobs.length;
    for (const mob of this.mobs) {
      if (!mob.isAlive) {
        --count;
        continue;
      }
      mob.takeTurn(this, (hitHero) => {
        if (hitHero && this.heroAlive) {
          this.heroDie(mob);
        } else if (--count <= 0) {
          this.heroTurn = true;
        }
      });
    }

    if (count <= 0) {
      this.heroTurn = true;
    }
  }

  private heroDie(killedBy: Mob): void {
    this.lastKilledBy = killedBy.name;
    this.hero.die(killedBy.direction);
    this.clock.stop();
  }
}
