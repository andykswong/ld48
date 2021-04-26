import * as THREE from 'three';
import { attack, die, jump, rotate, scytheAttack, zombieAttack } from './animations';
import { GhostMesh } from './models/ghost';
import { HumanoidMesh } from './models/humanoid';
import { ReaperMesh } from './models/reaper';
import { WizardMesh } from './models/wizard';
import { BullMesh } from './models/zbull';
import { ZombieMesh } from './models/zombie';
import { Props } from './props';
import { Sound } from './sound';

export const HUMANOID_TYPE = {
  Hero: 0,
  Zombie: 1,
  Ghost: 2,
  Bull: 3,
  Reaper: 4
};

export class Humanoid {
  public isMoving = false;
  public isAlive = true;

  public constructor(
    public type: number,
    public mesh: HumanoidMesh,
    public position: THREE.Vector2 = new THREE.Vector2(0, 0),
    public direction: THREE.Vector2 = new THREE.Vector2(0, -1)
  ) {
    rotate(this.mesh.mesh, new THREE.Vector3(direction.x, 0, -direction.y));
    this.mesh.mesh.position.x = position.x * 10;
    this.mesh.mesh.position.z = position.y * -10;
  }

  public rotate(direction: THREE.Vector2): void {
    this.direction.set(Math.sign(direction.x), Math.sign(direction.y));
    rotate(this.mesh.mesh, new THREE.Vector3(direction.x, 0, -direction.y));
  }

  public move(direction: THREE.Vector2, onComplete?: () => void): void {
    if (this.isMoving) {
      return;
    }
    this.isMoving = true;

    this.direction.set(Math.sign(direction.x), Math.sign(direction.y));
    this.position.add(direction);
    jump(this.mesh.mesh, new THREE.Vector3(10 * direction.x, 0, -10 * direction.y), () => {
      this.isMoving = false;
      onComplete?.();
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public attack(direction: THREE.Vector2, onComplete?: () => void): void {
    // do nothing
  }

  public die(direction: THREE.Vector2, onComplete?: () => void): void {
    this.isAlive = false;
    die(this.mesh, new THREE.Vector3(direction.x, 0, direction.y), onComplete);
  }
  
  public addTo(parent: THREE.Object3D): void {
    parent.add(this.mesh.mesh);
  }
  
  public detach(): void {
    this.mesh.mesh.parent?.remove(this.mesh.mesh);
  }
}

export class Hero extends Humanoid {
  constructor() {
    super(HUMANOID_TYPE.Hero, new WizardMesh(), new THREE.Vector2(0, 2), new THREE.Vector2(0, -1));
  }

  public move(direction: THREE.Vector2, onComplete?: () => void): void {
    if (!this.isMoving) {
      super.move(direction, onComplete);
      Sound.Footstep.load();
      Sound.Footstep.play();
    }
  }

  public attack(direction: THREE.Vector2, onComplete?: () => void): void {
    if (this.isMoving) {
      return;
    }
    this.isMoving = true;

    rotate(this.mesh.mesh, new THREE.Vector3(direction.x, 0, -direction.y));
    this.direction.set(Math.sign(direction.x), Math.sign(direction.y));
    attack(this.mesh.rightArm, () => {
      this.isMoving = false;
      onComplete?.();
    });
    Sound.Slash.load();
    Sound.Slash.play();
  }
}

interface ObjectState {
  hero: Hero;
  props: Props[];
  mobs: Mob[];
}

export class Mob extends Humanoid {
  public name = 'mob';

  public takeTurn(state: ObjectState, onComplete?: (hitHero: boolean) => void): void {
    onComplete?.(false);
  }
}

export class Zombie extends Mob {
  constructor(position: THREE.Vector2, direction: THREE.Vector2 = new THREE.Vector2(0, -1)) {
    super(HUMANOID_TYPE.Zombie, new ZombieMesh(), position, direction);
    this.name = 'Zombie';
  }

  public attack(direction: THREE.Vector2, onComplete?: () => void): void {
    if (this.isMoving) {
      return;
    }
    this.isMoving = true;

    rotate(this.mesh.mesh, new THREE.Vector3(direction.x, 0, -direction.y));
    this.direction.set(Math.sign(direction.x), Math.sign(direction.y));
    zombieAttack(this.mesh, () => {
      this.isMoving = false;
      onComplete?.();
    });
    Sound.Zombie.load();
    Sound.Zombie.play();
  }

  public takeTurn(state: ObjectState, onComplete?: (hitHero: boolean) => void): void {
    const dx = state.hero.position.x - this.position.x;
    const dy = state.hero.position.y - this.position.y;

    if (Math.abs(dx) + Math.abs(dy) > 1 && 
      ((dy && Math.sign(dy) === this.direction.y) || (dx && Math.sign(dx) === this.direction.x))
    ) {
      if (!hasSomething(state.mobs, this.position.x + this.direction.x, this.position.y + this.direction.y) &&
        !hasSomething(state.props, this.position.x + this.direction.x, this.position.y + this.direction.y) &&
        this.position.x + this.direction.x >= -4 && this.position.x + this.direction.x <= 4
      ) {
        this.move(this.direction, () => onComplete?.(false));
        return;
      }
    }

    if (dy && Math.sign(dy) !== this.direction.y) {
      this.rotate(new THREE.Vector2(0, Math.sign(dy)));
      onComplete?.(false);
    } else if (dx && Math.sign(dx) !== this.direction.x) {
      this.rotate(new THREE.Vector2(Math.sign(dx), 0));
      onComplete?.(false);
    } else if (Math.abs(dx) + Math.abs(dy) === 1) {
      this.attack(this.direction, () => onComplete?.(true));
    } else {
      onComplete?.(false);
    }
  }
}

export class Ghost extends Mob {
  constructor(position: THREE.Vector2, direction: THREE.Vector2 = new THREE.Vector2(0, -1)) {
    super(HUMANOID_TYPE.Ghost, new GhostMesh(), position, direction);
    this.name = 'Specter';
  }

  public attack(direction: THREE.Vector2, onComplete?: () => void): void {
    rotate(this.mesh.mesh, new THREE.Vector3(direction.x, 0, -direction.y));
    this.direction.set(Math.sign(direction.x), Math.sign(direction.y));
    zombieAttack(this.mesh, () => {
      onComplete?.();
    });
    Sound.Ghost.load();
    Sound.Ghost.play();
  }

  public takeTurn(state: ObjectState, onComplete?: (hitHero: boolean) => void): void {
    let dx = state.hero.position.x - this.position.x;
    let dy = state.hero.position.y - this.position.y;
    const sx = Math.sign(dx);
    const sy = Math.sign(dy);

    const dir: [number, number][] = [];
    if (sx) {
      if (sy) {
        dir.push([sx, sy], [sx, -sy], [-sx, sy]);
      } else {
        dir.push([sx, 1], [sx, -1]);
        dy = dx - sx;
      }
    } else {
      if (sy) {
        dir.push([1, sy], [-1, sy]);
        dx = dy - sy;
      } else { // should not happen
        onComplete?.(false);
        return;
      }
    }

    let x = 0, y = 0;
    for (const [sx, sy] of dir) {
      x = 0;
      y = 0;
      for (x = 0, y = 0; Math.abs(x) < Math.abs(dx) && Math.abs(y) < Math.abs(dy); x += sx, y += sy) {
        if (this.position.x + x + sx < -4 || this.position.x + x + sx > 4 ||
          hasSomething(state.mobs, this.position.x + x + sx, this.position.y + y + sy) ||
          hasSomething(state.props, this.position.x + x + sx, this.position.y + y + sy)
        ) {
          break;
        }
      }
      if (Math.abs(x) > 0) {
        break;
      }
    }

    if (x === dx && y === dy) {
      this.attack(this.direction);
      this.move(new THREE.Vector2(x, y), () => onComplete?.(true));
    } else if (Math.abs(x) > 0) {
      this.move(new THREE.Vector2(x, y), () => onComplete?.(false));
    } else {
      this.rotate(new THREE.Vector2(sx, sy));
      onComplete?.(false);
    }
  }
}

export class Bull extends Mob {
  constructor(position: THREE.Vector2, direction: THREE.Vector2 = new THREE.Vector2(0, -1)) {
    super(HUMANOID_TYPE.Bull, new BullMesh(), position, direction);
    this.name = 'Bull';
  }

  public attack(direction: THREE.Vector2, onComplete?: () => void): void {
    rotate(this.mesh.mesh, new THREE.Vector3(direction.x, 0, -direction.y));
    this.direction.set(Math.sign(direction.x), Math.sign(direction.y));
    zombieAttack(this.mesh, () => {
      onComplete?.();
    });
    Sound.Bull.load();
    Sound.Bull.play();
  }

  public takeTurn(state: ObjectState, onComplete?: (hitHero: boolean) => void): void {
    const fdx = state.hero.position.x - this.position.x;
    const fdy = state.hero.position.y - this.position.y;
    const sx = Math.sign(fdx);
    const sy = Math.sign(fdy);
    const dx = sx * Math.min(6, Math.abs(fdx));
    const dy = sy * Math.min(6, Math.abs(fdy));

    const dir: [number, number][] = [];
    if (sx) {
      dir.push([sx, 0]);
    }
    if (sy) {
      dir.push([0, sy]);
    }

    let x = 0, y = 0;
    let mobKilled: Mob | null = null;
    for (const [sx, sy] of dir) {
      x = 0;
      y = 0;
      for (x = 0, y = 0; (sx && Math.abs(x) < Math.abs(dx)) || (sy && Math.abs(y) < Math.abs(dy)); x += sx, y += sy) {
        if (this.position.x + x + sx < -4 || this.position.x + x + sx > 4 ||
          hasSomething(state.props, this.position.x + x + sx, this.position.y + y + sy)
        ) {
          break;
        }
        mobKilled = getAtPos(state.mobs, this.position.x + x + sx, this.position.y + y + sy);
        if (mobKilled) {
          x += sx, y += sy;
          break;
        }
      }
      if (Math.abs(x) > 0 || Math.abs(y) > 0) {
        break;
      }
    }

    if (x === fdx && y === fdy) {
      this.attack(this.direction);
      this.move(new THREE.Vector2(x, y), () => onComplete?.(true));
    } else if (Math.abs(x) > 0 || Math.abs(y) > 0) {
      if (mobKilled) {
        mobKilled.die(new THREE.Vector2(Math.sign(x), Math.sign(y)), ((i) => () => {
          state.mobs[i].detach();
          state.mobs[i] = state.mobs[state.mobs.length - 1];
          state.mobs.pop();
        })(state.mobs.indexOf(mobKilled)));
      }
      this.move(new THREE.Vector2(x, y), () => onComplete?.(false));
    } else {
      this.rotate(new THREE.Vector2(sx, sy));
      onComplete?.(false);
    }
  }
}

export class Reaper extends Mob {
  constructor(position: THREE.Vector2, direction: THREE.Vector2 = new THREE.Vector2(0, -1)) {
    super(HUMANOID_TYPE.Reaper, new ReaperMesh(), position, direction);
    this.name = 'Reaper';
  }

  public attack(direction: THREE.Vector2, onComplete?: () => void): void {
    rotate(this.mesh.mesh, new THREE.Vector3(direction.x, 0, -direction.y));
    this.direction.set(Math.sign(direction.x), Math.sign(direction.y));
    scytheAttack(this.mesh.rightArm, () => {
      onComplete?.();
    });
    Sound.Slash.load();
    Sound.Slash.play();
  }

  public takeTurn(state: ObjectState, onComplete?: (hitHero: boolean) => void): void {
    const fdx = state.hero.position.x - this.position.x;
    const fdy = state.hero.position.y - this.position.y;
    const sx = Math.sign(fdx);
    const sy = Math.sign(fdy);
    const dx = sx * Math.min(6, Math.abs(fdx));
    const dy = sy * Math.min(6, Math.abs(fdy));

    const dir: [number, number][] = [];
    if (sx) {
      if (sy) {
        dir.push([sx, sy], [sx, 0], [0, sy]);
      } else {
        dir.push([sx, 0]);
      }
    } else {
      if (sy) {
        dir.push([0, sy]);
      } else { // should not happen
        onComplete?.(false);
        return;
      }
    }

    let x = 0, y = 0;
    let mobKilled: Mob | null = null;
    for (const [sx, sy] of dir) {
      x = 0;
      y = 0;
      for (x = 0, y = 0; (sx && Math.abs(x) < Math.abs(dx)) || (sy && Math.abs(y) < Math.abs(dy)); x += sx, y += sy) {
        if (
          this.position.x + x + sx < -4 || this.position.x + x + sx > 4 ||
          (
            Math.abs(this.position.x + x + sx - state.hero.position.x) + Math.abs(this.position.y + y + sy - state.hero.position.y) === 1 &&
            Math.abs(this.position.x + x + 2 * sx - state.hero.position.x) + Math.abs(this.position.y + y + 2 * sy - state.hero.position.y) !== 0
          )
        ) {
          break;
        }
        mobKilled = getAtPos(state.mobs, this.position.x + x + sx, this.position.y + y + sy);
        if (mobKilled) {
          x += sx, y += sy;
          break;
        }
      }
      if (Math.abs(x) > 0 || Math.abs(y) > 0) {
        break;
      }
    }

    if (x === fdx && y === fdy) {
      this.attack(this.direction);
      this.move(new THREE.Vector2(x, y), () => onComplete?.(true));
    } else if (Math.abs(x) > 0 || Math.abs(y) > 0) {
      if (mobKilled) {
        mobKilled.die(new THREE.Vector2(Math.sign(x), Math.sign(y)), ((i) => () => {
          state.mobs[i].detach();
          state.mobs[i] = state.mobs[state.mobs.length - 1];
          state.mobs.pop();
        })(state.mobs.indexOf(mobKilled)));
      }
      this.move(new THREE.Vector2(x, y), () => onComplete?.(false));
    } else {
      this.rotate(new THREE.Vector2(sx, sy));
      onComplete?.(false);
    }
  }
}

function hasSomething(mobs: { position: THREE.Vector2 }[], x: number, y: number): boolean {
  return getAtPos(mobs, x, y) !== null;
}

function getAtPos<T extends { position: THREE.Vector2 }>(mobs: T[], x: number, y: number): T | null {
  for (const mob of mobs) {
    if (mob.position.x === x && mob.position.y === y) {
      return mob;
    }
  }
  return null;
}
