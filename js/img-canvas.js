const wrapper = document.querySelector("#canvas-wrapper")
const imageCanvas = document.querySelector("#board2");
const imageCtx = imageCanvas.getContext("2d");

const image = new Image()
image.src = "./img/sample2.jpg"
image.onload = ()=> drawImage()

const scaledImgSize = {

}

const drawImage = () => {
  const xScale = image.width /imageCanvas.width
  const yScale = image.height / imageCanvas.height

  // 画像サイズに合わせたサイズ算出
  const scale = xScale > yScale ? xScale : yScale
  scaledImgSize.width = image.width / scale
  scaledImgSize.height = image.height / scale
  
  // 描画位置を算出
  const drawPos = {
    x: imageCanvas.width / 2 - scaledImgSize.width / 2,
    y: imageCanvas.height / 2 - scaledImgSize.height / 2,
  }


  imageCtx.drawImage(image, 0, 0, image.width, image.height, drawPos.x, drawPos.y, scaledImgSize.width, scaledImgSize.height)
}



// 任意の箇所を起点とした拡大 
// https://codepen.io/torukano/pen/XWbxoGB
let scale = 1;
const SCALE_MIN = 1;
const SCALE_MAX = 1.2;
wrapper.addEventListener('wheel', (e)=> {
  e.preventDefault();
  
  const rect = e.target.getBoundingClientRect();
  x = e.clientX - rect.left;
  y = e.clientY - rect.top;
  // console.log(x, y)
  let newScale = scale + e.deltaY * -0.001
  newScale = Math.min(Math.max(SCALE_MIN, newScale), SCALE_MAX);
  newScale = round(newScale);
  
  if( newScale === scale) return
  else scale = newScale

  Array.from(wrapper.children).forEach((e)=> {
    // TODO 拡大したときに
    e.style.transformOrigin = `${x}px ${y}px`
    e.style.transform = `scale(${scale})`
  })
  reDraw()
}, false)