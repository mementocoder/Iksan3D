import { AnimationMixer } from "three";

export class Player {
  constructor(info) {
    this.moving = false;

    info.gltfLoader.load(info.modelSrc, (glb) => {
      glb.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
        }
      });

      this.modelMesh = glb.scene.children[0];
      this.modelMesh.position.y = -3;
      // this.modelMesh.position.y = 0.3;
      this.modelMesh.name = "maryong";
      info.scene.add(this.modelMesh);
      info.meshes.push(this.modelMesh);

      this.actions = [];

      this.mixer = new AnimationMixer(this.modelMesh);
      this.actions[0] = this.mixer.clipAction(glb.animations[1]);
      this.actions[1] = this.mixer.clipAction(glb.animations[2]);
      this.actions[0].play();
    });
  }
}
