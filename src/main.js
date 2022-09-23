import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Player } from "./Player";
import { House } from "./House";
import { Meshes } from "./Mesh";
import gsap from "gsap";

// Modal
const description = document.querySelector("#description");
const startBtn = document.querySelector("#start");
startBtn.addEventListener("click", e => {
  description.style.display = "none";
});

// Texture - Grid
const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load("/images/grid.png");
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.x = 26;
floorTexture.repeat.y = 26;

// Renderer
const canvas = document.querySelector("#three-canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.OrthographicCamera(
  -(window.innerWidth / window.innerHeight), // left
  window.innerWidth / window.innerHeight, // right,
  1, // top
  -1, // bottom
  -1000,
  1000
);

const cameraPosition = new THREE.Vector3(2.5, 25, 5);
camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
camera.zoom = 0.2;
camera.updateProjectionMatrix();
scene.add(camera);

// Light
const ambientLight = new THREE.AmbientLight("white", 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("white", 0.5);
const directionalLightOriginPosition = new THREE.Vector3(1, 1, 1);
directionalLight.position.x = directionalLightOriginPosition.x;
directionalLight.position.y = directionalLightOriginPosition.y;
directionalLight.position.z = directionalLightOriginPosition.z;
directionalLight.castShadow = true;

// mapSize 세팅으로 그림자 퀄리티 설정
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
// 그림자 범위
directionalLight.shadow.camera.left = -100;
directionalLight.shadow.camera.right = 100;
directionalLight.shadow.camera.top = 100;
directionalLight.shadow.camera.bottom = -100;
directionalLight.shadow.camera.near = -100;
directionalLight.shadow.camera.far = 100;
scene.add(directionalLight);

// 스프라이트 애니메이션 함수
function TextureAnimator(
  texture,
  tilesHoriz,
  tilesVert,
  numTiles,
  tileDispDuration
) {
  // note: texture passed by reference, will be updated by the update function.

  this.tilesHorizontal = tilesHoriz;
  this.tilesVertical = tilesVert;
  // how many images does this spritesheet contain?
  //  usually equals tilesHoriz * tilesVert, but not necessarily,
  //  if there at blank tiles at the bottom of the spritesheet.
  this.numberOfTiles = numTiles;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical);

  // how long should each image be displayed?
  this.tileDisplayDuration = tileDispDuration;

  // how long has the current image been displayed?
  this.currentDisplayTime = 0;

  // which image is currently being displayed?
  this.currentTile = 0;

  this.update = function (milliSec) {
    this.currentDisplayTime += milliSec;
    while (this.currentDisplayTime > this.tileDisplayDuration) {
      this.currentDisplayTime -= this.tileDisplayDuration;
      this.currentTile++;
      if (this.currentTile == this.numberOfTiles) this.currentTile = 0;
      var currentColumn = this.currentTile % this.tilesHorizontal;
      texture.offset.x = currentColumn / this.tilesHorizontal;
      var currentRow = Math.floor(this.currentTile / this.tilesHorizontal);
      texture.offset.y = currentRow / this.tilesVertical;
    }
  };
}

// Mesh
const meshes = []; // 추후 코드 수정 필요
const floorMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(60, 100),
  new THREE.MeshStandardMaterial({
    map: floorTexture,
  })
);
floorMesh.name = "floor";
floorMesh.rotation.x = -Math.PI / 2;
floorMesh.rotation.z = 0.45;
floorMesh.position.x = 25;
floorMesh.position.z = 30;
floorMesh.receiveShadow = true;
scene.add(floorMesh);
meshes.push(floorMesh);

const meshList = {
  sprite: [
    {
      path: "start.png",
      width: 4,
      height: 5,
      pX: 0,
      pY: 0.12,
      pZ: 0,
      rX: -Math.PI / 2,
      rY: 0,
      rZ: 0.45,
    },
    {
      path: "click.png",
      width: 1.5,
      height: 1.5,
      pX: 15.5,
      pY: -2,
      pZ: 4.5,
      rX: 0,
      rY: 0.47,
      rZ: 0,
    },
    {
      path: "click.png",
      width: 1.5,
      height: 1.5,
      pX: 22.5,
      pY: -2,
      pZ: 21.3,
      rX: 0,
      rY: 0.47,
      rZ: 0,
    },
    {
      path: "event3.png",
      width: 2,
      height: 2,
      pX: 21,
      pY: 0.1,
      pZ: 1.2,
      rX: -Math.PI / 2,
      rY: 0,
      rZ: 0.45,
    },
    {
      path: "event3.png",
      width: 2,
      height: 2,
      pX: -8.2,
      pY: 0.1,
      pZ: 4.3,
      rX: -Math.PI / 2,
      rY: 0,
      rZ: 0.45,
    },
  ],
  deco: [
    { path: "check.png", width: 4, height: 0.88, pX: 1.24, pY: 0.1, pZ: 2.85 },
    {
      path: "check2.png",
      width: 4,
      height: 0.88,
      pX: 1.24,
      pY: -0.1,
      pZ: 2.85,
    },
    { path: "start2.png", width: 3, height: 3, pX: -1.35, pY: 0.1, pZ: -2.7 },
    { path: "foot.png", width: 3, height: 3, pX: 3.85, pY: 0.1, pZ: -2.35 },
    { path: "mesh-deco1.png", width: 3, height: 3, pX: 1.9, pY: 0.1, pZ: -5.5 },
    {
      path: "mesh-deco2.png",
      width: 3,
      height: 3,
      pX: -6.3,
      pY: 0.1,
      pZ: -0.6,
    },
    {
      path: "mesh-deco3.png",
      width: 8,
      height: 8,
      pX: -5,
      pY: 0.1,
      pZ: 4.5,
    },
    {
      path: "mesh-deco4.png",
      width: 6,
      height: 6,
      pX: 13.8,
      pY: 0.1,
      pZ: 5.6,
    },
    {
      path: "arrow.png",
      width: 8,
      height: 8,
      pX: 6.4,
      pY: 0.1,
      pZ: 6.4,
    },
    {
      path: "mesh-deco6.png",
      width: 6,
      height: 6,
      pX: 2.7,
      pY: 0.1,
      pZ: 12,
    },
    {
      path: "mesh-deco7.png",
      width: 1,
      height: 1,
      pX: -3.8,
      pY: 0.1,
      pZ: 0.7,
    },
    {
      path: "mesh-deco5.png",
      width: 3,
      height: 3,
      pX: 19.6,
      pY: 0.1,
      pZ: 8,
    },
    {
      path: "arrow2.png",
      width: 8,
      height: 8,
      pX: 17,
      pY: 0.1,
      pZ: 12.8,
    },
    {
      path: "mesh-deco8.png",
      width: 3,
      height: 3,
      pX: 9.7,
      pY: 0.1,
      pZ: 17.1,
    },
    {
      path: "mesh-deco9.png",
      width: 5,
      height: 5,
      pX: 17.5,
      pY: 0.1,
      pZ: -4.3,
    },
    {
      path: "mesh-deco10.png",
      width: 5,
      height: 5,
      pX: 23.8,
      pY: 0.1,
      pZ: 1.7,
    },
  ],
  stand: [
    {
      path: "/models/mesh-stand2.glb",
      width: 3,
      height: 3,
      pX: 6.5,
      pY: 0.5,
      pZ: 4.4,
      rX: 80,
      rY: 84.8,
      rZ: 40.4,
    },
    {
      path: "/models/mesh-stand2.glb",
      width: 3,
      height: 3,
      pX: 8.6,
      pY: 0.3,
      pZ: 4.7,
      rX: 80,
      rY: 84.8,
      rZ: 40.4,
    },
    {
      path: "/models/mesh-stand2.glb",
      width: 3,
      height: 3,
      pX: 8.3,
      pY: 0.7,
      pZ: 2.8,
      rX: 80,
      rY: 84.8,
      rZ: 40.4,
    },
    {
      path: "/models/mesh-stand4.glb",
      width: 3,
      height: 3,
      pX: 2.2,
      pY: 0.5,
      pZ: 20.8,
      rX: 80,
      rY: 84.8,
      rZ: 40.4,
    },
    {
      path: "/models/mesh-stand5.glb",
      width: 3,
      height: 3,
      pX: 4.0,
      pY: 0.5,
      pZ: 21.7,
      rX: 80,
      rY: 84.8,
      rZ: 40.4,
    },
    {
      path: "/models/mesh-stand4.glb",
      width: 3,
      height: 3,
      pX: 3.8,
      pY: 0.5,
      pZ: 18.4,
      rX: 80,
      rY: 84.8,
      rZ: 40.4,
    },
    {
      path: "/models/mesh-stand1.glb",
      width: 3,
      height: 3,
      pX: 12,
      pY: 0.5,
      pZ: -6.1,
      rX: 80,
      rY: 84.8,
      rZ: 40.4,
    },
    {
      path: "/models/mesh-stand1.glb",
      width: 3,
      height: 3,
      pX: 10.0,
      pY: 0.5,
      pZ: -6.6,
      rX: 80,
      rY: 84.8,
      rZ: 40.4,
    },
    {
      path: "/models/mesh-stand1.glb",
      width: 3,
      height: 3,
      pX: 12.4,
      pY: 0.5,
      pZ: -8.8,
      rX: 80,
      rY: 84.8,
      rZ: 40.4,
    },
  ],
  easterEgg: [],
  story1: [
    {
      path: "/models/미륵사지.glb",
      pX: 13.1,
      pY: -6,
      pZ: 8.6,
      rX: 80,
      rY: 84.8,
      rZ: 40.4,
    },
  ],
  story2: [
    {
      path: "/models/동고도리.glb",
      pX: 18,
      pY: -3,
      pZ: 23.5,
      rX: 80,
      rY: 84.8,
      rZ: 40.4,
    },
    {
      path: "/models/동고도리.glb",
      pX: 21.3,
      pY: -3,
      pZ: 22.1,
      rX: 80,
      rY: 84.8,
      rZ: 40.4,
    },
    {
      path: "/models/동고도리비석.glb",
      pX: 20.4,
      pY: -3,
      pZ: 23.8,
      rX: 80,
      rY: 84.8,
      rZ: 40.4,
    },
  ],
};

const BASE_TEXT_IMG_PATH = "/images/";

const spriteAni = [];
const spriteMesh = [];
meshList.sprite.map(img => {
  var texture = textureLoader.load(`${BASE_TEXT_IMG_PATH}${img.path}`);

  var box = new THREE.Mesh(
    new THREE.PlaneGeometry(img.width, img.height),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true })
  );
  box.position.set(img.pX, img.pY, img.pZ);
  box.rotation.x = img.rX;
  box.rotation.y = img.rY;
  box.rotation.z = img.rZ;
  spriteMesh.push(box);
  scene.add(box);

  var ani = new TextureAnimator(
    texture, // 스프라이트 텍스쳐 객체 지정
    2, // 가로 갯수
    2, // 세로 갯수
    4, // 총 갯수
    1000 // 이미지컷당 변경 시간간격(1000분의 1초)
  );

  spriteAni.push(ani);
});

// 그냥 땅바닥 이미지
const decoMesh = [];
meshList.deco.map(img => {
  const text = new Meshes(`${BASE_TEXT_IMG_PATH}${img.path}`, textureLoader);
  const _spotMeshText = text.setMesh(
    img.width,
    img.height,
    img.pX,
    img.pY,
    img.pZ
  );
  _spotMeshText.rotation.x = -Math.PI / 2;
  _spotMeshText.rotation.z = 0.45;
  decoMesh.push(_spotMeshText);
  scene.add(_spotMeshText);
});

const gltfLoader = new GLTFLoader();
// 세운 이미지
const standMesh = [];
meshList.stand.map(img => {
  const suktop = new House({
    gltfLoader,
    scene,
    modelSrc: img.path,
    x: img.pX,
    y: img.pY,
    z: img.pZ,
    x2: img.rX,
    y2: img.rY,
    z2: img.rZ,
  });
  standMesh.push(suktop);
});

// 영역 들어갔을때 뿅 올라오는 이미지
const storyMesh0 = [];
meshList.story1.map(img => {
  const suktop = new House({
    gltfLoader,
    scene,
    modelSrc: img.path,
    x: img.pX,
    y: img.pY,
    z: img.pZ,
    x2: img.rX,
    y2: img.rY,
    z2: img.rZ,
  });
  storyMesh0.push(suktop);
});

const storyMesh1 = [];
meshList.story2.map(img => {
  const suktop = new House({
    gltfLoader,
    scene,
    modelSrc: img.path,
    x: img.pX,
    y: img.pY,
    z: img.pZ,
    x2: img.rX,
    y2: img.rY,
    z2: img.rZ,
  });
  storyMesh1.push(suktop);
});

// 영역
function spot(x, y, x2, y2) {
  const spotMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(x, y),
    new THREE.MeshStandardMaterial({
      transparent: true,
    })
  );
  spotMesh.position.set(x2, -0.1, y2);
  spotMesh.rotation.x = -Math.PI / 2;
  spotMesh.rotation.z = 0.45;
  spotMesh.receiveShadow = true;

  return spotMesh;
}

const spotMesh1 = spot(3.5, 3.5, 13.9, 5.2);
const spotMesh2 = spot(6, 6, 20, 23);
const spotMesh3 = spot(6, 6, 10, 40);
const spotMesh4 = spot(6, 6, 27, 57);
scene.add(spotMesh1);
scene.add(spotMesh2);
scene.add(spotMesh3);
scene.add(spotMesh4);

// 마우스 클릭 위치
const pointerMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
  })
);
pointerMesh.rotation.x = -Math.PI / 2;
pointerMesh.position.y = 0;
pointerMesh.receiveShadow = true;
scene.add(pointerMesh);

//그림자;
// const house = new House({
//   gltfLoader,
//   scene,
//   modelSrc: "/models/mount.glb",
//   x: 10,
//   y: 0.5,
//   z: 10,
// });

// 3D 모델
// const sgdory = new House({
//   gltfLoader,
//   scene,
//   modelSrc: "/models/서고도리.glb",
//   x: -5,
//   y: 1,
//   z: 0,
// });

// 마룡
const player = new Player({
  scene,
  meshes,
  gltfLoader,
  modelSrc: "/models/마룡이.glb",
});

const raycaster = new THREE.Raycaster();
// 빛으로 쏴서 메쉬가 맞으면 얘가 누군지 잡아낼 수 있는 거 -> 마우스 클릭했을 때 그 지점을 얻어내와야 일분이 이동, 여기에 필요
let mouse = new THREE.Vector2();
let destinationPoint = new THREE.Vector3();
let angle = 0; // 일분이가 걸어갈 각도, 마우스를 계속 바라보는거 자체가 각도를 계산했다는거
let isPressed = false; // 마우스를 누르고 있는 상태

let isClick = "false";
let played = "false";
// 그리기
const clock = new THREE.Clock();
function draw() {
  const delta = clock.getDelta();

  spriteAni[0].update(1000 * delta);
  spriteAni[1].update(1000 * delta);
  spriteAni[2].update(1000 * delta);
  spriteAni[3].update(1000 * delta);
  spriteAni[4].update(1000 * delta);

  if (player.mixer) player.mixer.update(delta); // mixer는 애니메이션 때문에 해준거죠. 업데이트 계속 해줘야 애니메이션이 됨
  // console.log(mouse.x + " " + mouse.y);
  if (isClick == "false") {
    if (player.modelMesh) {
      // 모델 리소스가 적용(로드)될때까지 기다림
      camera.lookAt(spriteMesh[0].position); // 카메라가 플레이어의 모델 mesh를 바라보게하는거
      if (mouse.x > -0.2 && mouse.x < -0.1) {
        if (mouse.y > -0.65 && mouse.y < -0.55) {
          // camera.lookAt(player.modelMesh.position);

          // const bgm = document.querySelector("#bgm");
          // bgm.play(); //BGM기능

          gsap.to(decoMesh[0].position, {
            //원위치
            duration: 0.5,
            y: -0.1,
          });
          gsap.to(decoMesh[1].position, {
            //원위치
            duration: 0.5,
            y: 0.1,
          });

          gsap.to(camera.position, {
            //원위치
            duration: 4,
            x: 1,
            y: 5,
            z: 5,
          });
          mouse.x = 0;
          mouse.y = 0;

          gsap.to(player.modelMesh.position, {
            //원위치
            duration: 3,
            y: 0.3,
            ease: "easeOut",
          });
          setTimeout(() => (description.style.display = "flex"), 4000);
          setTimeout(() => (isClick = "true"), 5000);
        }
      }
    }
  } else {
    if (player.modelMesh) {
      // 모델 리소스가 적용(로드)될때까지 기다림
      camera.lookAt(player.modelMesh.position); // 카메라가 플레이어의 모델 mesh를 바라보게하는거
    }

    if (player.modelMesh) {
      if (isPressed) {
        // 마우스가 눌린 상태에만 이 함수 호출. draw함수에 넣음으로써 마우스 누른 상태에선 계속 레이케스팅 됨, 타겟 위치가 계속 바뀌니 계속 체킹해주게 해줌, 마우스 누를 때만(계속 누르고 있을 때 졸졸따라다니는 기능을 위함)
        raycasting();
        // 결과에 따라 움직여줌
      }

      if (player.moving) {
        // 걸어가는 상태
        angle = Math.atan2(
          // 현재 지점에서 마우스 클릭 지점까지 걸어갈 각도 계산->점과 점사이의 각도 계산 - 아크탄젠트2
          destinationPoint.z - player.modelMesh.position.z,
          destinationPoint.x - player.modelMesh.position.x
        );
        player.modelMesh.position.x += Math.cos(angle) * 0.05; //그 좌표를 이용해 이동시킴
        player.modelMesh.position.z += Math.sin(angle) * 0.05;

        camera.position.x =
          cameraPosition.x + player.modelMesh.position.x - 1.5; // 일분이가 움직인만큼 카메라도 움직이게 함. 카메라가 계속 따라 움직임 그래서 화면에 고정돼보이는거.
        camera.position.z = cameraPosition.z + player.modelMesh.position.z;

        player.actions[0].stop(); // 기본 대기상태 꺼주고
        player.actions[1].play(); // 걷기상태를 켜줌
        // console.log(mouse.x + " " + mouse.y);
        // 목표지점과 플레이어 값이 특정값에 도달하면 멈춰(뺀 값이 작으면 거의 목표지점 도달한거니)
        if (
          Math.abs(destinationPoint.x - player.modelMesh.position.x) < 0.03 &&
          Math.abs(destinationPoint.z - player.modelMesh.position.z) < 0.03
        ) {
          player.moving = false;
          console.log("멈춤");
        }
        // spot메쉬(노란색)에 진입할때
        storyMesh0.forEach(sMesh => {
          if (
            Math.abs(spotMesh1.position.x - player.modelMesh.position.x) < 4 &&
            Math.abs(spotMesh1.position.z - player.modelMesh.position.z) < 4
          ) {
            // console.dir(sMesh);
            // 집 보이도록
            if (!sMesh.visible) {
              //안보이는 상태라면 보이도록
              console.log("나와");
              sMesh.visible = true;
              gsap.to(sMesh.modelMesh.position, {
                // 집 메쉬가
                duration: 1, // 1초동안
                y: 0.8, // y(위로 나오니까)
                ease: "Bounce.easeOut", // 재밌게 띠용(라이브러리가 가지고 있는 값)
              });
              gsap.to(camera.position, {
                // 카메라 포지션 변경
                duration: 1,
                y: 3,
              });
              gsap.to(spriteMesh[1].position, {
                duration: 1,
                y: 3.5,
                ease: "Bounce.easeOut",
              });
              gsap.to(decoMesh[7].position, {
                duration: 1,
                y: -0.1,
              });
            }
          } else if (sMesh.visible) {
            // 집 보이는 상태라면 반대로 집어넣어
            console.log("들어가");

            sMesh.visible = false;
            gsap.to(camera.position, {
              //원위치
              duration: 1,
              y: 5,
            });
          }
        });
        storyMesh1.forEach(sMesh => {
          if (
            Math.abs(spotMesh2.position.x - player.modelMesh.position.x) < 4 &&
            Math.abs(spotMesh2.position.z - player.modelMesh.position.z) < 4
          ) {
            // 집 보이도록
            if (!sMesh.visible) {
              //안보이는 상태라면 보이도록
              console.log("나와");
              sMesh.visible = true;
              spotMesh2.material.color.set("#88E700");
              gsap.to(sMesh.modelMesh.position, {
                // 집 메쉬가
                duration: 1, // 1초동안
                y: 1, // y(위로 나오니까)
                ease: "Bounce.easeOut", // 재밌게 띠용(라이브러리가 가지고 있는 값)
              });
              gsap.to(camera.position, {
                // 카메라 포지션 변경
                duration: 1,
                y: 3,
              });
              gsap.to(spriteMesh[2].position, {
                // 카메라 포지션 변경
                duration: 1,
                y: 3.8,
                ease: "Bounce.easeOut",
              });
            }
          } else if (sMesh.visible) {
            // 집 보이는 상태라면 반대로 집어넣어
            console.log("들어가");

            sMesh.visible = false;
            gsap.to(camera.position, {
              //원위치
              duration: 1,
              y: 5,
            });
          }
        });
      } else {
        // 서 있는 상태(큰 if 조건. 플레이어 걸어가는 상태가 아니라면)
        player.actions[1].stop(); // 플레이어 걸어가는거 멈춰주고
        player.actions[0].play(); // 까딱까딱
      }
    }
  }

  renderer.render(scene, camera);
  renderer.setAnimationLoop(draw);
}

function playVideo(x, z) {
  if (x > 11.5 && x < 16.5) {
    if (z > 4.5 && z < 8.0) {
      if (played == "false") {
        const first = document.querySelector("#first");
        first.style.display = "flex";
        mouse.x = 0;
        mouse.y = 0;
        played = "true";
        first.addEventListener("click", e => {
          first.style.display = "none";
          setTimeout(() => (played = "false"), 3000);
        });
      }
    }
  }
  if (x > 17 && x < 22) {
    if (z > 21 && z < 25) {
      if (played == "false") {
        const second = document.querySelector("#second");
        second.style.display = "flex";
        mouse.x = 0;
        mouse.y = 0;
        played = "true";
        second.addEventListener("click", e => {
          second.style.display = "none";
          setTimeout(() => (played = "false"), 3000);
        });
      }
    }
  }
  19.5;
  23;
}

function playEvent(x, z) {
  if (x > -7.5 && x < -2.5) {
    if (z > 2.5 && z < 5.5) {
      if (played == "false") {
        const event = document.querySelector("#event");
        event.style.display = "flex";
        mouse.x = 0;
        mouse.y = 0;
        setTimeout(() => (event.style.display = "none"), 2000);
        played = "true";
        setTimeout(() => (played = "false"), 3000);
      }
    }
  }
  if (x > 22 && x < 25) {
    if (z > -0.5 && z < 2.5) {
      if (played == "false") {
        const event2 = document.querySelector("#event2");
        event2.style.display = "flex";
        mouse.x = 0;
        mouse.y = 0;
        setTimeout(() => (event2.style.display = "none"), 2000);
        played = "true";
        setTimeout(() => (played = "false"), 3000);
      }
    }
  }
}

function checkIntersects() {
  raycaster.setFromCamera(mouse, camera);
  // 클릭하면 실행됨.
  const intersects = raycaster.intersectObjects(meshes);
  for (const item of intersects) {
    if (item.object.name === "floor") {
      // 바닥 클릭했을 때(메쉬 네임 floor라고 위에서 지정했음)
      // dest~ 상수임 위에보면 Vector3로 기본 0,0,0가리키는 점, 이 위치를 바꿔줄거임
      destinationPoint.x = item.point.x; // item는 mesh들, point는 현재 내가 클릭한 mesh에서, 죽 클릭한(광선에 맞은) point를 알려줌 그 지점을 목표로 dest로 설정해서 캐릭터 이동시키는 코드
      destinationPoint.y = 0.3; // 하늘 날고 땅으로 꺼지는게 아닌 평면상에서만 움직이므로, x, z로만 움직여, y는 일분이 키에 맞게 적절히 잘 맞춰준거(배꼽정도)
      destinationPoint.z = item.point.z;
      player.modelMesh.lookAt(destinationPoint); // 일분이가 마우스 좌표쪽을 바라봄
      player.moving = true; // 움직이는 상태니 true로 해줌
      playVideo(item.point.x, item.point.z);
      playEvent(item.point.x, item.point.z);
      console.log(item.point.x + " " + item.point.z);

      pointerMesh.position.x = destinationPoint.x; // 일분이 밑 빨간애도 이동시켜줘야하니까
      pointerMesh.position.z = destinationPoint.z;
    }
    break;
  }
}
function setSize() {
  // 카메라
  camera.left = -(window.innerWidth / window.innerHeight);
  camera.right = window.innerWidth / window.innerHeight;
  camera.top = 1;
  camera.bottom = -1;

  camera.updateProjectionMatrix(); // 카메라 투영에 관련된 값에 변화가 있을 경우 실행해야 함
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera); // 변화가 됐으니 렌더러도 해줘야함
}

// 이벤트
window.addEventListener("resize", setSize);

// 마우스 좌표를 three.js에 맞게 변환
function calculateMousePosition(e) {
  mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1;
  mouse.y = -((e.clientY / canvas.clientHeight) * 2 - 1);
}

// 변환된 마우스 좌표를 이용해 래이캐스팅
function raycasting() {
  raycaster.setFromCamera(mouse, camera);
  checkIntersects();
}

// 마우스 이벤트
canvas.addEventListener("mousedown", e => {
  //마우스 눌렀을 때
  isPressed = true;

  calculateMousePosition(e);
  // 클릭했을때 마우스 좌표를 three.js에맞게 비율 변환시키는 함수, 가운데가 0, 왼쪽은 -1, 오른쪽은 1 이런식
});
canvas.addEventListener("mouseup", () => {
  // 마우스 땠을 때
  isPressed = false;
});
canvas.addEventListener("mousemove", e => {
  // 마우스를 움직일때
  if (isPressed) {
    // 근데 누른 상태일 때
    calculateMousePosition(e);
  }
});

// 터치 이벤트 - 마우스랑 똑같다
canvas.addEventListener("touchstart", e => {
  // 기기 선택했을때
  isPressed = true;
  calculateMousePosition(e.touches[0]); // 마우스랑 다른점은 배열형태(손가락 터치 처음한 애(사람은 다섯손가락이니까))
});
canvas.addEventListener("touchend", () => {
  isPressed = false;
});
canvas.addEventListener("touchmove", e => {
  if (isPressed) {
    calculateMousePosition(e.touches[0]);
  }
});

draw();
