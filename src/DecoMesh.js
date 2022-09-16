import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();
const scene = new THREE.Scene();

export function DecoMesh() {
  const meshDecoList = [];

  const mainTexture = textureLoader.load("./images/main.png");
  // mainTexture.wrapS = THREE.RepeatWrapping;
  // mainTexture.wrapT = THREE.RepeatWrapping;

  const mainMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
      map: mainTexture,
      transparent: true,
    })
  );
  mainMesh.name = "main";
  mainMesh.rotation.x = 0;
  mainMesh.rotation.y = 0.47;
  mainMesh.position.y = 3;
  mainMesh.receiveShadow = true;

  return mainMesh;
}

/*
  class 말고 모듈로 만들어서 하려고함
  mesh 종류마다 필요한 코드 (name, 조명 등)가 다른데,
  정해진 class 틀에서 하려고 하니까 어떻게 해야할 지 모르겠음
  class 내에서 변수를 선언하면 그걸 다 매개변수를 이용해서 사용해야하는건가?..
  그것땜시 막혀서 모듈로 만드는거엿음
  근데 scene add를 이 함수 내에서 못하네?
  main.js에선 그냥 함수만 호출하도록 하는 방법이 없을까    
*/
