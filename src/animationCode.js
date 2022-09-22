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

var a = textureLoader.load("/images/ezgif.com-gif-maker.png");

var box = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshBasicMaterial({ map: a, transparent: true })
);

scene.add(box);

var ani = new TextureAnimator(
  a, // 스프라이트 텍스쳐 객체 지정
  5, // 가로 갯수
  4, // 세로 갯수
  20, // 총 갯수
  50 // 이미지컷당 변경 시간간격(1000분의 1초)
);

ani.update(1000 * delta);
