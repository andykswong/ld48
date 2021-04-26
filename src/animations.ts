import * as THREE from 'three';
import { Bounce, Power4, TimelineLite } from 'gsap';
import { HumanoidMesh } from './models/humanoid';

export function rotate(mesh: THREE.Object3D, dir: THREE.Vector3): void {
  const rotationY = (dir.x > 0 ? Math.PI / 2 : dir.x < 0 ? Math.PI * 3 / 2 : dir.z > 0 ? 0 : Math.PI);
  mesh.rotation.copy(new THREE.Euler(0, rotationY, 0));
}

export function jump(mesh: THREE.Object3D, dir: THREE.Vector3, onComplete?: () => void): void {
  const initialPosition = mesh.position.clone();

  const groundLevel = 0;
  const delta = dir.clone();
  const targetPosition = delta.clone().add(initialPosition);
  const timing = 0.1;

  rotate(mesh, dir);

  const timeline = new TimelineLite();

  const posTimeline = new TimelineLite();
  posTimeline
    .to(mesh.position, timing, {
      x: initialPosition.x + (delta.x * 0.75),
      y: groundLevel + 5,
      z: initialPosition.z + (delta.z * 0.75),
    })
    .to(mesh.position, timing, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      ease: Power4.easeOut,
      delay: timing / 2,
      onComplete,
      onCompleteParams: []
    });

  const scaleTimeline = new TimelineLite();
  scaleTimeline
    .to(mesh.scale, timing, {
      x: 1,
      y: 1.1,
      z: 1,
    })
    .to(mesh.scale, timing, {
      x: 1,
      y: 0.9,
      z: 1
    })
    .to(mesh.scale, timing, {
      x: 1,
      y: 1,
      z: 1,
      ease: Bounce.easeOut
    });

  timeline
    .add(posTimeline)
    .add(scaleTimeline, 0);
}

export function attack(arm: THREE.Object3D, onComplete?: () => void): void {
  const initialRotation = arm.rotation.clone();

  const timing = 0.1;

  const rotTimeline = new TimelineLite();
  rotTimeline
    .to(arm.rotation, timing, {
      x: initialRotation.x - Math.PI / 4,
      y: initialRotation.y,
      z: initialRotation.z
    })
    .to(arm.rotation, timing, {
      x: initialRotation.x + Math.PI / 4,
      y: initialRotation.y,
      z: initialRotation.z,
      ease: Power4.easeOut,
      delay: timing / 2,
    })
    .to(arm.rotation, timing, {
      x: initialRotation.x,
      y: initialRotation.y,
      z: initialRotation.z,
      onComplete,
      onCompleteParams: []
    });
}

export function scytheAttack(arm: THREE.Object3D, onComplete?: () => void): void {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const att = arm.getObjectByName('rightHandAtt')!;
  const initialRotation = arm.rotation.clone();
  const initialAttRotation = att.rotation.clone();

  const timing = 0.1;

  const timeline = new TimelineLite();
  const rotTimeline = new TimelineLite();
  rotTimeline
    .to(arm.rotation, timing, {
      x: initialRotation.x - Math.PI / 4,
      y: initialRotation.y,
      z: initialRotation.z - Math.PI / 4,
    })
    .to(arm.rotation, timing, {
      x: initialRotation.x + Math.PI / 4,
      y: initialRotation.y + Math.PI / 2,
      z: initialRotation.z + Math.PI / 4,
      ease: Power4.easeOut,
      delay: timing / 2,
    })
    .to(arm.rotation, timing, {
      x: initialRotation.x,
      y: initialRotation.y,
      z: initialRotation.z,
      onComplete,
      onCompleteParams: []
    });
  
  const scytheTimeline = new TimelineLite();
  scytheTimeline
    .to(att.rotation, timing, {
      x: initialAttRotation.x - Math.PI / 2,
      y: initialAttRotation.y,
      z: initialAttRotation.z - Math.PI / 2,
    })
    .to(att.rotation, timing, {
      x: initialAttRotation.x + Math.PI / 2,
      y: initialAttRotation.y + Math.PI / 2,
      z: initialAttRotation.z - Math.PI / 4,
      ease: Power4.easeOut,
      delay: timing / 2,
    })
    .to(att.rotation, timing, {
      x: initialAttRotation.x,
      y: initialAttRotation.y,
      z: initialAttRotation.z
    });
  
  timeline.add(rotTimeline).add(scytheTimeline, 0);
}

export function die(mesh: HumanoidMesh, dir: THREE.Vector3, onComplete?: () => void): void {
  const timing = 0.1;
  const rotationY = (dir.x < 0 ? Math.PI / 2 : dir.x > 0 ? Math.PI * 3 / 2 : dir.z > 0 ? 0 : Math.PI);
  const bodyTimeline = new TimelineLite();
  bodyTimeline
    .to(mesh.mesh.rotation, 2 * timing, {
      x: -Math.PI / 2,
      y: 0,
      z: rotationY,
      ease: Power4.easeOut,
      delay: timing / 2,
      onComplete,
      onCompleteParams: []
    });
}

export function zombieAttack(zombie: HumanoidMesh, onComplete?: () => void): void {
  const initialRotation = zombie.body.rotation.clone();

  const timing = 0.1;

  const timeline = new TimelineLite();

  const bodyTimeline = new TimelineLite();
  bodyTimeline
    .to(zombie.body.rotation, timing, {
      x: initialRotation.x - Math.PI / 4,
      y: initialRotation.y,
      z: initialRotation.z
    })
    .to(zombie.body.rotation, timing, {
      x: initialRotation.x + Math.PI / 2,
      y: initialRotation.y,
      z: initialRotation.z,
      ease: Power4.easeOut,
      delay: timing / 2,
    })
    .to(zombie.body.rotation, timing, {
      x: initialRotation.x,
      y: initialRotation.y,
      z: initialRotation.z,
      onComplete,
      onCompleteParams: []
    });

  timeline
    .add(bodyTimeline)
    .add(zombieArmAttack(zombie.leftArm, timing), 0)
    .add(zombieArmAttack(zombie.rightArm, timing), 0);
}

export function zombieArmAttack(zombieArm: THREE.Object3D, timing: number): TimelineLite {
  const initialRotation = zombieArm.rotation.clone();
  const timeline = new TimelineLite();
  timeline
    .to(zombieArm.rotation, timing, {
      x: initialRotation.x - Math.PI / 2,
      y: initialRotation.y,
      z: initialRotation.z
    })
    .to(zombieArm.rotation, timing, {
      x: initialRotation.x + Math.PI / 6,
      y: initialRotation.y,
      z: initialRotation.z,
      ease: Power4.easeOut,
      delay: timing / 2,
    })
    .to(zombieArm.rotation, timing, {
      x: initialRotation.x,
      y: initialRotation.y,
      z: initialRotation.z,
    });
  return timeline;
}