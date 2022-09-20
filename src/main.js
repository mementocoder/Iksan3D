import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Player } from "./Player";
// import { House } from "./House";
import { Meshes } from "./Mesh";
import gsap from "gsap";
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

const cameraPosition = new THREE.Vector3(1, 15, 12);
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
  deco: [{ path: "마룡테스트.gif", width: 3, height: 3, pX: 0, pY: 0, pZ: 0 }],
  stand: [
    { path: "main.png", width: 10, height: 10, pX: 5, pY: 3, pZ: 0 },
    { path: "main.png", width: 4, height: 4, pX: 3, pY: 3, pZ: 7 },
  ],
  easterEgg: [],
  story: [
    { path: "나무테스트.png", width: 2, height: 2, pX: 13, pY: 1, pZ: 6 },
    { path: "나무테스트.png", width: 2, height: 2, pX: 15, pY: 1, pZ: 6 },
    { path: "나무테스트.png", width: 2, height: 2, pX: 18, pY: 1, pZ: 6 },
  ],
  arear: [],
};

const BASE_TEXT_IMG_PATH = "/images/";

// 그냥 땅바닥 이미지
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
  scene.add(_spotMeshText);
});

// 세운 이미지
meshList.stand.map(img => {
  const text = new Meshes(`${BASE_TEXT_IMG_PATH}${img.path}`, textureLoader);
  const _spotMeshText = text.setMesh(
    img.width,
    img.height,
    img.pX,
    img.pY,
    img.pZ
  );
  _spotMeshText.rotation.x = 0;
  _spotMeshText.rotation.y = 0.47;
  scene.add(_spotMeshText);
});

// 영역 들어갔을때 뿅 올라오는 이미지
const storyMesh = [];
meshList.story.map(img => {
  const text = new Meshes(`${BASE_TEXT_IMG_PATH}${img.path}`, textureLoader);
  const _spotMeshText = text.setMesh(
    img.width,
    img.height,
    img.pX,
    img.pY,
    img.pZ
  );
  _spotMeshText.rotation.x = 0;
  _spotMeshText.rotation.y = 0.47;
  _spotMeshText.visible = false;
  // _spotMeshText.visible = false;
  storyMesh.push(_spotMeshText);
  scene.add(_spotMeshText);
});
console.dir(storyMesh);

// 영역
const spotMesh1 = new THREE.Mesh(
  new THREE.PlaneGeometry(3, 3),
  new THREE.MeshStandardMaterial({
    color: "yellow",
    transparent: true,
    opacity: 0.5,
  })
);
spotMesh1.position.set(13, 0.005, 6);
spotMesh1.rotation.x = -Math.PI / 2;
spotMesh1.rotation.z = 0.45;
spotMesh1.receiveShadow = true;
scene.add(spotMesh1);

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

const gltfLoader = new GLTFLoader();

// 그림자
// const house = new House({
//   gltfLoader,
//   scene,
//   modelSrc: "/images/untitled.glb",
//   x: 5,
//   y: 0.5,
//   z: 2,
// });

// 집
// const house = new House({
//   gltfLoader,
//   scene,
//   modelSrc: "/models/house.glb",
//   x: 5,
//   y: -1.3,
//   z: 2,
// });
// 마룡
const player = new Player({
  scene,
  meshes,
  gltfLoader,
  modelSrc: "/models/maryong.glb",
});

const raycaster = new THREE.Raycaster();
// 빛으로 쏴서 메쉬가 맞으면 얘가 누군지 잡아낼 수 있는 거 -> 마우스 클릭했을 때 그 지점을 얻어내와야 일분이 이동, 여기에 필요
let mouse = new THREE.Vector2();
let destinationPoint = new THREE.Vector3();
let angle = 0; // 일분이가 걸어갈 각도, 마우스를 계속 바라보는거 자체가 각도를 계산했다는거
let isPressed = false; // 마우스를 누르고 있는 상태

let isClick = "false";
// 그리기
const clock = new THREE.Clock();
console.dir(player);
function draw() {
  const delta = clock.getDelta();

  if (player.mixer) player.mixer.update(delta); // mixer는 애니메이션 때문에 해준거죠. 업데이트 계속 해줘야 애니메이션이 됨
  console.log(mouse.x + " " + mouse.y);
  if (isClick == "false") {
    if (player.modelMesh) {
      // 모델 리소스가 적용(로드)될때까지 기다림
      camera.lookAt(storyMesh[0].position); // 카메라가 플레이어의 모델 mesh를 바라보게하는거
      if (mouse.x > -1 && mouse.x < -0.5) {
        if (mouse.y > -1 && mouse.y < -0.5) {
          camera.lookAt(player.modelMesh.position);
          gsap.to(camera.position, {
            //원위치
            duration: 4,
            y: 5,
            z: 5,
          });
          setTimeout(() => (isClick = "true"), 4000);
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

        camera.position.x = cameraPosition.x + player.modelMesh.position.x; // 일분이가 움직인만큼 카메라도 움직이게 함. 카메라가 계속 따라 움직임 그래서 화면에 고정돼보이는거.
        camera.position.z = cameraPosition.z + player.modelMesh.position.z - 7;

        player.actions[0].stop(); // 기본 대기상태 꺼주고
        player.actions[1].play(); // 걷기상태를 켜줌
        console.log(mouse.x + " " + mouse.y);
        // 목표지점과 플레이어 값이 특정값에 도달하면 멈춰(뺀 값이 작으면 거의 목표지점 도달한거니)
        if (
          Math.abs(destinationPoint.x - player.modelMesh.position.x) < 0.03 &&
          Math.abs(destinationPoint.z - player.modelMesh.position.z) < 0.03
        ) {
          player.moving = false;
          console.log("멈춤");
        }
        // spot메쉬(노란색)에 진입할때
        if (
          Math.abs(spotMesh1.position.x - player.modelMesh.position.x) < 1.5 &&
          Math.abs(spotMesh1.position.z - player.modelMesh.position.z) < 1.5
        ) {
          // 집 보이도록

          if (!storyMesh[0].visible) {
            //안보이는 상태라면 보이도록
            console.log("나와");
            storyMesh[0].visible = true;
            spotMesh1.material.color.set("seagreen");
            gsap.to(storyMesh[0].position, {
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
          }
        } else if (storyMesh[0].visible) {
          // 집 보이는 상태라면 반대로 집어넣어
          console.log("들어가");

          storyMesh[0].visible = false;
          spotMesh1.material.color.set("yellow");
          gsap.to(storyMesh[0].position, {
            duration: 0.5,
            y: -1.3, // 원위치
          });
          gsap.to(camera.position, {
            //원위치
            duration: 1,
            y: 5,
          });
        }
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

function checkIntersects() {
  // raycaster.setFromCamera(mouse, camera); 계속 반복실행되는거니까 주석해둔거
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

      //console.log(item.point);

      player.moving = true; // 움직이는 상태니 true로 해줌

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
