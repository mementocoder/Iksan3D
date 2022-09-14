import {
  RepeatWrapping,
  Mesh,
  PlaneGeometry,
  MeshStandardMaterial,
} from "three";

export class Meshes {
  constructor(path, textureLoader) {
    this.path = path;
    this.textureLoader = textureLoader;
  }

  setSpotMeshTexture() {
    /* 해당 요소 나눌 필요 없이 생산자 parameter 비워주고
     * 하나의 함수로 처리해도 될 것으로 보이긴 함
     * Three js 이해도 없이 그냥 모듈화 실행
     */
    const _spotMeshTexture = this.textureLoader.load(this.path);
    _spotMeshTexture.wrapS = RepeatWrapping;
    _spotMeshTexture.wrapT = RepeatWrapping;
    return _spotMeshTexture;
  }

  setMesh(x1, y1, x2, y2) {
    const position = {
      x1: x1,
      x2: x2,
      y1: y1,
      y2: y2,
    };
    const _spotMeshTexture = this.setSpotMeshTexture();
    const _spotMeshText = new Mesh(
      new PlaneGeometry(position.x1, position.y1),
      new MeshStandardMaterial({
        map: _spotMeshTexture,
        transparent: true,
      })
    );
    _spotMeshText.position.set(position.x2, 0.1, position.y2);
    _spotMeshText.rotation.x = -Math.PI / 2;
    _spotMeshText.rotation.z = 0.45;
    _spotMeshText.receiveShadow = true;
    return _spotMeshText;
  }
}
