import * as THREE from 'three';
import { FLOOR_BLACK_MAT, FLOOR_BROWN_MAT, FLOOR_DEEP_BROWN_MAT, FLOOR_WHITE_MAT } from '../material';

const geom = new THREE.BoxGeometry(9.5, 1, 9.5);
geom.translate(0, -0.5, 0);

export const white = new THREE.Mesh(geom, FLOOR_WHITE_MAT);
white.receiveShadow = true;
export const black = new THREE.Mesh(geom, FLOOR_BLACK_MAT);
black.receiveShadow = true;
export const brown = new THREE.Mesh(geom, FLOOR_BROWN_MAT);
brown.receiveShadow = true;
export const dbrown = new THREE.Mesh(geom, FLOOR_DEEP_BROWN_MAT);
dbrown.receiveShadow = true;

export function createBlackFloorTile(): THREE.Object3D {
  return black.clone();
}

export function createWhiteFloorTile(): THREE.Object3D {
  return white.clone();
}

export function createBrownFloorTile(): THREE.Object3D {
  return brown.clone();
}

export function createDeepBrownFloorTile(): THREE.Object3D {
  return dbrown.clone();
}
