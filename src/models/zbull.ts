import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';
import { BROWN_MAT, DEEP_RED_MAT, LIGHT_STONE_MAT } from '../material';

const bodyGeo = new THREE.CylinderGeometry(3, 2.4, 3, 6);
bodyGeo.rotateY(Math.PI/4);
bodyGeo.translate(0, 0.3, 0);

const hipGeo = new THREE.BoxGeometry(3, 1, 2);
hipGeo.translate(0, -1.5, 0);

const faceGeo = new THREE.DodecahedronGeometry(1.7);
faceGeo.translate(0, 1, 0);

const legGeo = new THREE.BoxGeometry(1.25, 1.5, 1.25);
legGeo.translate(0, -0.75, 0);

let footGeo: THREE.BufferGeometry = new THREE.BoxGeometry(1.25, 1.5, 1.25);
footGeo.translate(0, -0.75, 0);
const footPlamGeo = new THREE.BoxGeometry(1.25, 0.8, 1);
footPlamGeo.translate(0, -1.1, 0.8);
footGeo = BufferGeometryUtils.mergeBufferGeometries([footGeo, footPlamGeo]);

const armGeo = new THREE.CylinderGeometry(1.5, 1, 2.5, 6);
armGeo.translate(0, -1.2, 0);

const lowerArmGeo = new THREE.BoxGeometry(1, 2, 1);
lowerArmGeo.translate(0, -1, 0);

export class BullMesh {
  public mesh = new THREE.Group();
  public body: THREE.Object3D;
  public leftArm: THREE.Object3D;
  public rightArm: THREE.Object3D;

  public constructor() {
    this.body = this.createBody();
    this.createHead();
    this.createLegs();
    const [leftArm, rightArm] = this.createArms();
    this.leftArm = leftArm;
    this.rightArm = rightArm;
    this.mesh.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
  }

  private createBody(): THREE.Mesh {
    const body = new THREE.Mesh(bodyGeo, BROWN_MAT);
    body.position.y = 5;
    this.mesh.add(body);
    const hip = new THREE.Mesh(hipGeo, LIGHT_STONE_MAT);
    hip.position.y = 5;
    this.mesh.add(hip);

    return body;
  }

  private createHead(): void {
    const head = new THREE.Mesh(faceGeo, DEEP_RED_MAT);
    head.position.y = 2;
    this.body.add(head);
  }

  private createLegs(): void {
    const leftLeg = new THREE.Mesh(legGeo, LIGHT_STONE_MAT);
    leftLeg.position.x = 0.8;
    leftLeg.position.y = -2 + 5;
    this.mesh.add(leftLeg);

    const leftFoot = new THREE.Mesh(footGeo, DEEP_RED_MAT);
    leftFoot.position.y = -1.5;
    leftLeg.add(leftFoot);

    const rightLeg = new THREE.Mesh(legGeo, LIGHT_STONE_MAT);
    rightLeg.position.x = -0.8;
    rightLeg.position.y = -2 + 5;
    this.mesh.add(rightLeg);

    const rightFoot = new THREE.Mesh(footGeo, DEEP_RED_MAT);
    rightFoot.position.y = -1.5;
    rightLeg.add(rightFoot);
  }

  private createArms(): [THREE.Object3D, THREE.Object3D] {
    const leftArm = new THREE.Mesh(armGeo, BROWN_MAT);
    leftArm.position.x = 1.5;
    leftArm.position.y = 1.5;
    leftArm.rotateX(-Math.PI/4);
    leftArm.rotateZ(Math.PI/6);
    this.body.add(leftArm);

    const leftHand = new THREE.Mesh(lowerArmGeo, DEEP_RED_MAT);
    leftHand.position.y = -1.5;
    leftHand.rotateZ(-Math.PI/16);
    leftHand.rotateX(-Math.PI / 8);
    leftArm.add(leftHand);

    const rightArm = new THREE.Mesh(armGeo, BROWN_MAT);
    rightArm.position.x = -1.5;
    rightArm.position.y = 1.5;
    rightArm.rotateX(-Math.PI/4);
    rightArm.rotateZ(-Math.PI / 6);
    this.body.add(rightArm);

    const rightHand =new THREE.Mesh(lowerArmGeo, DEEP_RED_MAT);
    rightHand.position.y = -1.5;
    rightHand.rotateZ(Math.PI / 16);
    rightHand.rotateX(-Math.PI / 12);
    rightArm.add(rightHand);

    const rightHandAtt = new THREE.Group();
    rightHandAtt.name = 'rightHandAtt';
    rightHandAtt.position.y = -2;
    rightHandAtt.rotateZ(Math.PI / 16);
    rightHandAtt.rotateX(Math.PI / 4);
    rightHand.add(rightHandAtt);

    return [leftArm, rightArm];
  }
}
