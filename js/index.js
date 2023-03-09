/*
 * canvas
 */

const canvas = document.querySelector("#board");
const ctx = canvas.getContext("2d");

const list = document.querySelector("#list");

let isEdit = false;

const rectPos = {
  x: 0,
  y: 0,
  w: 0,
  h: 0,
};

const displayRects = [];

const round = (num, digits = 1) => {
  const exponent = 10 ** digits;
  return Math.round(num * exponent) / exponent;
};

const getScaledMousePosition = (e) => {
  const rect = e.target.getBoundingClientRect();
  return {
    x: round((e.clientX - rect.left) / scale),
    y: round((e.clientY - rect.top) / scale),
  };
};

const draw = (e) => {
  const mousePos = getScaledMousePosition(e);

  rectPos.w = round(mousePos.x - rectPos.x);
  rectPos.h = round(mousePos.y - rectPos.y);

  reDraw();
  drawOnCanvas({ ...rectPos }, false);
};

const appendList = () => {
  const parseRect = {
    xmin: rectPos.x,
    ymin: rectPos.y,
    xmax: rectPos.x + rectPos.w,
    ymax: rectPos.y + rectPos.h,
    label: selectedLabel,
  };
  console.log(rectPos);

  const li = document.createElement("li");
  li.innerHTML = JSON.stringify(parseRect);
  displayRects.push({ ...parseRect });
  li.addEventListener("click", drawFromLi);
  list.appendChild(li);
};

const drawFromLi = (e) => {
  const rect = JSON.parse(e.target.innerHTML);

  const targetIndex = displayRects.findIndex((d) => {
    return Object.keys(rect).every((key) => rect[key] === d[key]);
  });

  if (targetIndex !== -1) {
    e.target.classList.add("not-active");
    displayRects.splice(targetIndex, 1);
  } else {
    e.target.classList.remove("not-active");
    displayRects.push({ ...rect });
  }

  reDraw();
};

const drawOnCanvas = (rect, isLable = true) => {
  ctx.beginPath();
  ctx.lineWidth = 1;

  ctx.rect(rect.x, rect.y, rect.w, rect.h);
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.strokeStyle = "black";
  ctx.fill();
  ctx.stroke();

  // label
  if (isLable) {
    ctx.fillStyle = "black";
    ctx.fillRect(rect.x - 1, rect.y - 20, rect.label.length * 14, 20);
    ctx.font = "14px serif";
    ctx.fillStyle = "white";
    ctx.fillText(rect.label, rect.x, rect.y - 5);
  }
};

const reDraw = () => {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  displayRects.forEach((d) =>
    drawOnCanvas(
      {
        x: d.xmin,
        y: d.ymin,
        w: d.xmax - d.xmin,
        h: d.ymax - d.ymin,
        label: d.label,
      },
      true
    )
  );
};

const onClick = (e) => {
  const mousePos = getScaledMousePosition(e);
  const { x, y } = mousePos;

  if (!isEdit) {
    rectPos.x = x;
    rectPos.y = y;
    isEdit = true;
    canvas.addEventListener("mousemove", draw);
  } else {
    isEdit = false;

    // 反転した場合の整形
    if (x < rectPos.x) {
      rectPos.x = x;
      rectPos.w = Math.abs(rectPos.w);
    }

    if (y < rectPos.y) {
      rectPos.y = y;
      rectPos.h = Math.abs(rectPos.h);
    }

    appendList();
    reDraw();
    (rectPos.x = 0), (rectPos.y = 0);
    canvas.removeEventListener("mousemove", draw);
  }
};
canvas.addEventListener("click", onClick);

/*
 * label form
 */
let selectedLabel = "Car";
const formEls = document.getElementsByName("label-form");
const onChangeForm = (e) => (selectedLabel = e.target.value);

formEls.forEach((d) => d.addEventListener("change", onChangeForm));
