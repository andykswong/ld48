import * as THREE from 'three';
import { GHOST_MAT } from '../material';

const bodyGeo = new THREE.CylinderGeometry(1.3, 1.8, 4, 6);
bodyGeo.scale(1.5, 1, 1);

const faceGeo = new THREE.CylinderGeometry(1.3, 1.5, 1.8, 4);
faceGeo.rotateY(Math.PI / 4);
faceGeo.translate(0, 1, 0);

const legGeo = new THREE.BoxGeometry(1.25, 2, 1.25);
legGeo.rotateX(Math.PI/6);
legGeo.translate(0, -0.75, 0);

const armGeo = new THREE.BoxGeometry(1, 1.5, 1);
armGeo.translate(0, -0.75, 0);

const lowerArmGeo = new THREE.BoxGeometry(0.8, 1.5, 0.8);
lowerArmGeo.translate(0, -0.75, 0);

export class GhostMesh {
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
    const body = new THREE.Mesh(bodyGeo, GHOST_MAT);
    body.position.y = 5;
    this.mesh.add(body);

    return body;
  }

  private createHead(): void {
    const head = new THREE.Mesh(faceGeo, GHOST_MAT);
    head.position.y = 2;
    this.body.add(head);
  }

  private createLegs(): void {
    const leftLeg = new THREE.Mesh(legGeo, GHOST_MAT);
    leftLeg.position.x = 0.8;
    leftLeg.position.y = -2 + 5;
    this.mesh.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, GHOST_MAT);
    rightLeg.position.x = -0.8;
    rightLeg.position.y = -2 + 5;
    this.mesh.add(rightLeg);
  }

  private createArms(): [THREE.Object3D, THREE.Object3D] {
    const leftArm = new THREE.Mesh(armGeo, GHOST_MAT);
    leftArm.position.x = 1.5;
    leftArm.position.y = 1.5;
    leftArm.rotateX(-Math.PI*.4);
    leftArm.rotateZ(Math.PI/8);
    this.body.add(leftArm);

    const leftHand = new THREE.Mesh(lowerArmGeo, GHOST_MAT);
    leftHand.position.y = -1.5;
    leftHand.rotateZ(-Math.PI/16);
    leftHand.rotateX(-Math.PI / 8);
    leftArm.add(leftHand);

    const rightArm = new THREE.Mesh(armGeo, GHOST_MAT);
    rightArm.position.x = -1.5;
    rightArm.position.y = 1.5;
    rightArm.rotateX(-Math.PI*.4);
    rightArm.rotateZ(-Math.PI / 8);
    this.body.add(rightArm);

    const rightHand =new THREE.Mesh(lowerArmGeo, GHOST_MAT);
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
