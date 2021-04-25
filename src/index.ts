/* eslint-disable @typescript-eslint/no-non-null-assertion */

import * as THREE from 'three';
import { Game } from './game';

const container = document.getElementById('game')!;
const score = document.getElementById('score')!;
const time = document.getElementById('time')!;
const title = document.getElementById('title')!;
const gameover = document.getElementById('gameover')!;

let highScore = 0;
let scoreNum = 0;
let isGameOver = true;

const game = new Game();
game.init(container);

window.addEventListener('resize', () => game.resize(), false);
window.addEventListener('keydown', (event) => {
  let dir = new THREE.Vector2(0, 0);
  switch (event.key) {
    case 'a':
    case 'ArrowLeft':
      dir = new THREE.Vector2(-1, 0);
      break;
    case 'w':
    case 'ArrowUp':
      dir = new THREE.Vector2(0, 1);
      break;
    case 'd':
    case 'ArrowRight':
      dir = new THREE.Vector2(1, 0);
      break;
    case 's':
    case 'ArrowDown':
      dir = new THREE.Vector2(0, -1);
      break;
    default:
      return;
  }
  game.move(dir);
});

const raycaster = new THREE.Raycaster();
const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
container.addEventListener('click', (e: MouseEvent) => {
  if (isGameOver) {
    isGameOver = false;
    title.style.display = 'none';
    gameover.style.display = 'none';
    time.style.display = 'block';
    playBgMusic();
    game.initScene();
  } else {
    const rect = container.getBoundingClientRect();
    const mouse = new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(mouse, game.camera);
    raycaster.ray.origin.set(mouse.x, mouse.y, - 1).unproject(game.camera);
    const pos = raycaster.ray.intersectPlane(groundPlane, new THREE.Vector3());
    if (pos) {
      let dx = Math.round(pos.x/10) - game.hero.position.x;
      let dy = Math.round(pos.z/-10) - game.hero.position.y;
      if (dx && dy) {
        if (Math.abs(dy) > Math.abs(dx)) {
          dx = 0;
        } else {
          dy = 0;
        }
      }
      game.move(new THREE.Vector2(Math.sign(dx), Math.sign(dy)));
    }
  }
});

game.loop(() => {
  if (!isGameOver) {
    const timeElapsed = game.clock.getElapsedTime();
    time.innerHTML = new Date(1000 * timeElapsed).toISOString().substr(11, 8);
  }
  if (game.score !== scoreNum) {
    scoreNum = game.score|0;
    highScore = Math.max(highScore, scoreNum);
    score.innerHTML = `${scoreNum}m`;
  }
  if (!isGameOver && !game.heroAlive) {
    gameover.style.display = 'block';
    gameover.innerHTML = `Oh no, a ${game.lastKilledBy} got you! Good job on surviving for ${scoreNum}m! <br/> Click to try again.`;
    isGameOver = true;
  }
});

function playBgMusic() {
  const audio = document.getElementById('bgmusic') as HTMLAudioElement;
  audio.loop = true;
  audio.play().then(() => audio.volume = 0.4);
}
