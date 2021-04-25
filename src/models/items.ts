import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';
import { DARK_PURPLE_MAT, LIGHT_STONE_MAT, SHINY_MAT, WOOD_MAT } from '../material';

const hatBtmGeo = new THREE.CylinderGeometry(2.3, 2.2, 0.2, 6);
hatBtmGeo.translate(0, 0.1, 0);
const hatTopGeo = new THREE.ConeGeometry(1.5, 2.5, 4);
hatTopGeo.translate(0, 1.25, 0);
hatTopGeo.rotateY(Math.PI / 4);
const hatGeo = BufferGeometryUtils.mergeBufferGeometries([hatBtmGeo, hatTopGeo]);

const woodGeo = new THREE.BoxGeometry(0.5, 10, 0.5);
woodGeo.translate(0, 2, 0);
const woodTopGeo = new THREE.BoxGeometry(1, 2, 1);
woodTopGeo.translate(0, 6, 0.4);
const staffGeo = BufferGeometryUtils.mergeBufferGeometries([woodGeo, woodTopGeo]);

const swordHiltGeo = new THREE.ConeGeometry(1, 1.5, 6);
swordHiltGeo.rotateX(Math.PI);
swordHiltGeo.translate(0, 1, 0);

const swordBladeGeo = new THREE.BoxGeometry(0.2, 6, 0.5);
swordBladeGeo.translate(0, 4, 0);
const swordTipGeo = new THREE.ConeGeometry(0.2, 1.5, 4);
swordTipGeo.translate(0, 7.5, 0);
const swordGeo = BufferGeometryUtils.mergeBufferGeometries([swordBladeGeo, swordTipGeo]);

export function createHat(): THREE.Mesh {
  return new THREE.Mesh(hatGeo, DARK_PURPLE_MAT);
}

export function createStaff(): THREE.Mesh {
  return new THREE.Mesh(staffGeo, WOOD_MAT);
}

export function createSword(): THREE.Mesh {
  const mesh = new THREE.Mesh(swordHiltGeo, WOOD_MAT);
  mesh.add(new THREE.Mesh(swordGeo, SHINY_MAT));

  return mesh;
}

const graveGeo = (() => {
  const baseGeo = new THREE.BoxGeometry(7, 1, 7);
  baseGeo.translate(0, 0.5, 0);
  const baseTopGeo = new THREE.CylinderGeometry(3.5, 4.5, 3, 4);
  baseTopGeo.rotateY(Math.PI/4);
  baseTopGeo.translate(0, 2, 0);
  
  const cross1Geo = new THREE.BoxGeometry(1, 15, 1);
  cross1Geo.translate(0, 10, 0);
  const cross2Geo = new THREE.BoxGeometry(8, 1, 1);
  cross2Geo.translate(0, 12.5, 0);

  return BufferGeometryUtils.mergeBufferGeometries([baseGeo, baseTopGeo, cross1Geo, cross2Geo]);
})();

export function createGrave(): THREE.Mesh {
  const mesh = new THREE.Mesh(graveGeo, LIGHT_STONE_MAT);
  mesh.castShadow = true;
  return mesh;
}

const grave2Geo = (() => {
  const baseGeo = new THREE.CylinderGeometry(4.5, 5, 2, 4);
  baseGeo.rotateY(Math.PI/4);
  baseGeo.scale(1, 1, 0.3);
  baseGeo.translate(0, 2, 0);
  const paneGeo = new THREE.BoxGeometry(6, 6, 1.5);
  paneGeo.translate(0, 6, 0);
  
  const topGeo = new THREE.ConeGeometry(5, 1, 4);
  topGeo.rotateY(Math.PI/4);
  topGeo.scale(1, 1, 0.3);
  topGeo.translate(0, 10, 0);
  const topGeo2 = new THREE.BoxGeometry(7, 1, 1.5);
  topGeo2.translate(0, 9, 0);

  return BufferGeometryUtils.mergeBufferGeometries([baseGeo, paneGeo, topGeo, topGeo2]);
})();

export function createGrave2(): THREE.Mesh {
  const mesh = new THREE.Mesh(grave2Geo, LIGHT_STONE_MAT);
  mesh.castShadow = true;
  return mesh;
}

const grave3Geo = (() => {
  const cross1Geo = new THREE.BoxGeometry(1, 9.5, 1);
  cross1Geo.translate(0, 4, 0);
  cross1Geo.rotateY(Math.PI/8);
  cross1Geo.rotateZ(Math.PI/16);
  const cross2Geo = new THREE.BoxGeometry(5, 1, 1);
  cross2Geo.translate(0, 7, 0);
  cross2Geo.rotateY(Math.PI/8);
  cross2Geo.rotateZ(Math.PI/16);
  const baseGeo = new THREE.CylinderGeometry(2.7, 3, 2, 6);
  baseGeo.rotateY(Math.PI/4);
  baseGeo.translate(0, 2, 0);
  return BufferGeometryUtils.mergeBufferGeometries([cross1Geo, cross2Geo, baseGeo]);
})();

export function createGrave3(): THREE.Mesh {
  const mesh = new THREE.Mesh(grave3Geo, LIGHT_STONE_MAT);
  mesh.castShadow = true;
  return mesh;
}

const stonesGeo = (() => {
  const stone1Geo = new THREE.BoxGeometry(2, 1.5, 1.5);
  stone1Geo.translate(-3, 1, -2);
  stone1Geo.rotateY(Math.PI/8);
  stone1Geo.rotateZ(Math.PI/16);
  const stone2Geo = new THREE.CylinderGeometry(1.7, 2, 1.2, 6);
  stone2Geo.rotateY(Math.PI/4);
  stone2Geo.translate(0.5, 0.6, 1);
  const stone3Geo = new THREE.BoxGeometry(2.1, 1.5, 1.75);
  stone3Geo.rotateY(-Math.PI/4);
  stone3Geo.translate(3, 1, -2);
  return BufferGeometryUtils.mergeBufferGeometries([stone1Geo, stone2Geo, stone3Geo]);
})();

export function createStones(): THREE.Mesh {
  const mesh = new THREE.Mesh(stonesGeo, LIGHT_STONE_MAT);
  mesh.castShadow = true;
  return mesh;
}

const treeGeo = (() => {
  const trunkGeo = new THREE.CylinderGeometry(0.7, 1.3, 14, 6);
  trunkGeo.translate(0, 6, 0);
  trunkGeo.rotateX(Math.PI/12);
  const trunk2Geo = new THREE.CylinderGeometry(0.4, 0.7, 5, 6);
  trunk2Geo.translate(0, 8, 0);
  trunk2Geo.rotateY(-Math.PI/8);
  trunk2Geo.rotateZ(-Math.PI/6);
  trunk2Geo.translate(-2.5, 4, 2.3);
  const trunk3Geo = new THREE.CylinderGeometry(0.4, 0.6, 4, 6);
  trunk3Geo.translate(0, 7, 0);
  trunk3Geo.rotateY(-Math.PI/4);
  trunk3Geo.rotateZ(Math.PI/6);
  trunk3Geo.translate(2, 1, 1.3);
  return BufferGeometryUtils.mergeBufferGeometries([trunk2Geo, trunkGeo, trunk3Geo]);
})();

export function createTree(): THREE.Mesh {
  const mesh = new THREE.Mesh(treeGeo, WOOD_MAT);
  mesh.castShadow = true;
  return mesh;
}

const stairGeo = (() => {
  const geo1 = new THREE.BoxGeometry(8, 2, 8);
  geo1.translate(0, 1, -1);
  const geo2 = new THREE.BoxGeometry(8, 2, 6);
  geo2.translate(0, 3, -2);
  const geo3 = new THREE.BoxGeometry(8, 2, 4);
  geo3.translate(0, 5, -3);
  const geo4 = new THREE.BoxGeometry(8, 2, 2);
  geo4.translate(0, 7, -4);
  return BufferGeometryUtils.mergeBufferGeometries([geo1, geo2, geo3, geo4]);
})();

export function createStair(): THREE.Mesh {

  const mesh = new THREE.Mesh(stairGeo, LIGHT_STONE_MAT);
  mesh.castShadow = true;
  return mesh;
}
