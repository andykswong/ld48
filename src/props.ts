import * as THREE from 'three';
import { rotate } from './animations';
import { createGrave, createGrave2, createGrave3, createStones, createTree } from './models/items';

export const PROPS: (() => THREE.Object3D)[] = [
  createGrave, createGrave2, createGrave3, createStones, createTree, createStones, createTree
];

export class Props {
  public mesh: THREE.Object3D;

  public constructor(
    public type: number,
    public position: THREE.Vector2 = new THREE.Vector2(0, 0),
    public direction: THREE.Vector2 = new THREE.Vector2(0, -1)
  ) {
    this.mesh = PROPS[type]();
    rotate(this.mesh, new THREE.Vector3(direction.x, 0, -direction.y));
    this.mesh.position.x = position.x * 10;
    this.mesh.position.z = -position.y * 10;
  }

  public addTo(parent: THREE.Object3D): void {
    parent.add(this.mesh);
  }
  
  public detach(): void {
    this.mesh.parent?.remove(this.mesh);
  }
}
