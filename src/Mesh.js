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

  setMesh(width, height, pX, pY, pZ) {
    const position = {
      width: width, // width
      height: height, // height
      pX: pX, // position x
      pY: pY, // position y
      pZ: pZ, // position z
    };
    const _spotMeshTexture = this.setSpotMeshTexture();
    const _spotMeshText = new Mesh(
      new PlaneGeometry(position.width, position.height),
      new MeshStandardMaterial({
        map: _spotMeshTexture,
        transparent: true,
      })
    );
    _spotMeshText.position.set(position.pX, position.pY, position.pZ);

    _spotMeshText.receiveShadow = true;
    return _spotMeshText;
  }
}
