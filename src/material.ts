import * as THREE from 'three';
import { COLOR } from './const';

export const DEEP_RED_MAT = new THREE.MeshPhongMaterial({
  color: COLOR.deepred
});

export const BLUE_GREEN_MAT = new THREE.MeshPhongMaterial({
  color: COLOR.bluegreen
});

export const LIGHT_STONE_MAT = new THREE.MeshPhongMaterial({
  color: COLOR.lightstone,
  shininess: 40,
  specular: COLOR.lightstone
});

export const SHINY_MAT = new THREE.MeshPhongMaterial({
  color: COLOR.white,
  shininess: 80,
  specular: COLOR.white
});

export const PURPLE_MAT = new THREE.MeshPhongMaterial({
  color: COLOR.purple
});

export const BROWN_MAT = new THREE.MeshPhongMaterial({
  color: COLOR.brown
});

export const DARK_PURPLE_MAT = new THREE.MeshPhongMaterial({
  color: COLOR.darkpurple
});

export const SKIN_MAT = new THREE.MeshPhongMaterial({
  color: COLOR.skin
});

export const WOOD_MAT = new THREE.MeshPhongMaterial({
  shininess: 15,
  color: COLOR.wood,
  specular: COLOR.lightstone
});

export const DULL_WOOD_MAT = new THREE.MeshPhongMaterial({
  shininess: 10,
  color: COLOR.wood,
  specular: COLOR.darkbrown
});

export const FLOOR_WHITE_MAT = new THREE.MeshPhongMaterial({
  shininess: 20,
  color: COLOR.floor,
});

export const FLOOR_BLACK_MAT = new THREE.MeshPhongMaterial({
  shininess: 20,
  color: COLOR.stone,
});

export const FLOOR_BROWN_MAT = new THREE.MeshPhongMaterial({
  shininess: 20,
  color: COLOR.darkbrown,
});

export const FLOOR_DEEP_BROWN_MAT = new THREE.MeshPhongMaterial({
  shininess: 20,
  color: COLOR.deepbrown,
});

export const GHOST_MAT = new THREE.MeshPhongMaterial({
  shininess: 0,
  color: COLOR.white,
  opacity: 0.5,
  transparent: true,
});

export const REAPER_MAT = new THREE.MeshPhongMaterial({
  shininess: 10,
  color: COLOR.black,
  opacity: 0.75,
  transparent: true,
});

export const GRASS_MAT = new THREE.MeshPhongMaterial({
  shininess: 40,
  color: COLOR.green,
  specular: COLOR.green,
});
