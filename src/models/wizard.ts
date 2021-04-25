import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';
import { BROWN_MAT, DARK_PURPLE_MAT, PURPLE_MAT, SKIN_MAT } from '../material';
import { createHat, createStaff, createSword } from './items';

export class WizardMesh {
  public mesh = new THREE.Group();
  public body: THREE.Object3D;
  public leftArm: THREE.Object3D;
  public rightArm: THREE.Object3D;
  public rightAtt!: THREE.Object3D;

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
    const bodyGeo = new THREE.BoxGeometry(3, 3, 2);
    bodyGeo.translate(0, 0.5, 0);

    const hipGeo = new THREE.BoxGeometry(3, 1, 2);
    hipGeo.translate(0, -1.5, 0);

    const torsoGeo = BufferGeometryUtils.mergeBufferGeometries([bodyGeo, hipGeo]);

    const body = new THREE.Mesh(torsoGeo, DARK_PURPLE_MAT);
    body.position.y = 5;
    this.mesh.add(body);
    return body;
  }

  private createHead(): void {
    const faceGeo = new THREE.BoxGeometry(1.8, 1.8, 1.8);
    faceGeo.translate(0, 1, 0);

    const head = new THREE.Mesh(faceGeo, SKIN_MAT);
    head.position.y = 2;
    this.body.add(head);

    const hat = createHat();
    hat.position.y = 1.8;
    hat.rotateX(-Math.PI / 16);
    head.add(hat);
  }

  private createLegs(): void {
    const legGeo = new THREE.BoxGeometry(1.25, 1.5, 1.25);
    legGeo.translate(0, -0.75, 0);

    let footGeo: THREE.BufferGeometry = new THREE.BoxGeometry(1.25, 1.5, 1.25);
    footGeo.translate(0, -0.75, 0);
    const footPlamGeo = new THREE.BoxGeometry(1.25, 0.8, 1);
    footPlamGeo.translate(0, -1.1, 0.8);
    footGeo = BufferGeometryUtils.mergeBufferGeometries([footGeo, footPlamGeo]);

    const leftLeg = new THREE.Mesh(legGeo, PURPLE_MAT);
    leftLeg.position.x = 0.8;
    leftLeg.position.y = -2;
    this.body.add(leftLeg);

    const leftFoot = new THREE.Mesh(footGeo, BROWN_MAT);
    leftFoot.position.y = -1.5;
    leftLeg.add(leftFoot);

    const rightLeg = new THREE.Mesh(legGeo, PURPLE_MAT);
    rightLeg.position.x = -0.8;
    rightLeg.position.y = -2;
    this.body.add(rightLeg);

    const rightFoot = new THREE.Mesh(footGeo, BROWN_MAT);
    rightFoot.position.y = -1.5;
    rightLeg.add(rightFoot);
  }

  private createArms(): [THREE.Object3D, THREE.Object3D] {
    const armGeo = new THREE.BoxGeometry(1, 1.5, 1);
    armGeo.translate(0, -0.75, 0);

    const lowerArmGeo = new THREE.BoxGeometry(1, 1.5, 1);
    lowerArmGeo.translate(0, -0.75, 0);

    const leftArm = new THREE.Mesh(armGeo, DARK_PURPLE_MAT);
    leftArm.position.x = 1.5;
    leftArm.position.y = 1.5;
    leftArm.rotateZ(Math.PI / 8);
    this.body.add(leftArm);

    const leftHand = new THREE.Mesh(lowerArmGeo, SKIN_MAT);
    leftHand.position.y = -1.5;
    leftHand.rotateX(-Math.PI / 8);
    leftArm.add(leftHand);

    const rightArm = new THREE.Mesh(armGeo, DARK_PURPLE_MAT);
    rightArm.position.x = -1.5;
    rightArm.position.y = 1.5;
    rightArm.rotateZ(-Math.PI / 8);
    this.body.add(rightArm);

    const rightHand =new THREE.Mesh(lowerArmGeo, SKIN_MAT);
    rightHand.position.y = -1.5;
    rightHand.rotateZ(Math.PI / 16);
    rightHand.rotateX(-Math.PI / 8);
    rightArm.add(rightHand);

    const rightHandAtt = new THREE.Group();
    rightHandAtt.name = 'rightHandAtt';
    rightHandAtt.position.y = -2;
    rightHandAtt.rotateZ(Math.PI / 16);
    rightHandAtt.rotateX(Math.PI / 4);
    rightHand.add(rightHandAtt);

    const staff = createSword();
    rightHandAtt.add(staff);
    this.rightAtt = rightHandAtt;

    return [leftArm, rightArm];
  }
}
