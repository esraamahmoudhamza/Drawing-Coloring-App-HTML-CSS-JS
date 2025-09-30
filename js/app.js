document.addEventListener('DOMContentLoaded', () => {
  // --- Canvas setup ---
  const canvas = document.getElementById("drawing-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 600;
  ctx.lineCap = 'round';

  // --- Tools ---
  const brushSize = document.getElementById("brush-size");
  const brushBtn = document.getElementById("brush");
  const eraserBtn = document.getElementById("eraser");
  const clearBtn = document.getElementById("clear");
  const colorPalette = document.getElementById("color-palette");

  let isDrawing = false;
  let currentColor = '#FF00FF';
  let currentSize = brushSize.value;
  let isEraser = false;

  // --- Neon color palette ---
  const neonColors = ['#FF00FF', '#8000FF', '#FF1493', '#00FFFF', '#7FFF00', '#FFFF00', '#FF4500', '#FF69B4', '#8A2BE2', '#00FF7F'];
  neonColors.forEach(color => {
    const div = document.createElement('div');
    div.style.backgroundColor = color;
    div.addEventListener('click', () => {
      currentColor = color;
      isEraser = false;
      brushBtn.classList.add('active');
      eraserBtn.classList.remove('active');
    });
    colorPalette.appendChild(div);
  });

  // --- Shapes (SVGs) ---
  const shapes = [
    { name: 'Rocket', path: 'assets/svgs/rocket.svg' },
    { name: 'Robot', path: 'assets/svgs/robot.svg' },
    { name: 'Car', path: 'assets/svgs/car.svg' },
    { name: 'Butterfly', path: 'assets/svgs/butterfly.svg' },
    { name: 'Whale', path: 'assets/svgs/whale.svg' },
    { name: 'Tree', path: 'assets/svgs/tree.svg' },
    { name: 'Castle', path: 'assets/svgs/castle.svg' },
    { name: 'Flower', path: 'assets/svgs/flower.svg' },
    { name: 'Cat', path: 'assets/svgs/cat.svg' },
    { name: 'House', path: 'assets/svgs/house.svg' }
  ];

  const thumbnails = document.getElementById('drawing-thumbnails');
  const shapesList = document.getElementById('shapesList');

  let backgroundImg = null;

  function loadShape(path) {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      backgroundImg = img;
    };
  }

  shapes.forEach(shape => {
    // Dropdown
    const option = document.createElement('option');
    option.value = shape.path;
    option.textContent = shape.name;
    shapesList.appendChild(option);

    // Thumbnails
    const thumbImg = document.createElement('img');
    thumbImg.src = shape.path;
    thumbImg.alt = shape.name;
    thumbImg.addEventListener('click', () => loadShape(shape.path));
    thumbnails.appendChild(thumbImg);
  });

  if (shapes.length > 0) {
    loadShape(shapes[0].path);
    shapesList.value = shapes[0].path;
  }

  shapesList.addEventListener('change', (e) => loadShape(e.target.value));

  // --- Drawing events ---
  canvas.addEventListener('mousedown', () => isDrawing = true);
  canvas.addEventListener('mouseup', () => isDrawing = false);
  canvas.addEventListener('mouseout', () => isDrawing = false);
  canvas.addEventListener('mousemove', e => {
    if (!isDrawing) return;
    ctx.fillStyle = isEraser ? '#fff' : currentColor; 
    ctx.beginPath();
    ctx.arc(e.offsetX, e.offsetY, currentSize, 0, Math.PI * 2);
    ctx.fill();
  });

  // --- Tool events ---
  brushSize.addEventListener('input', e => currentSize = e.target.value);

  brushBtn.addEventListener('click', () => {
    isEraser = false;
    brushBtn.classList.add('active');
    eraserBtn.classList.remove('active');
  });

  eraserBtn.addEventListener('click', () => {
    isEraser = true;
    eraserBtn.classList.add('active');
    brushBtn.classList.remove('active');
  });

  clearBtn.addEventListener('click', () => {
    if (backgroundImg) ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
});
