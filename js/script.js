// Seleciona o elemento canvas no HTML
const canvas = document.querySelector("canvas");
// Obtém o contexto de desenho 2D do canvas
const ctx = canvas.getContext("2d");

// Seleciona elementos HTML relacionados à pontuação e ao menu
const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");

// Cria um novo elemento de áudio e carrega um arquivo de áudio
const audio = new Audio("../assets/audio/audio.mp3");

// Define o tamanho dos blocos do jogo
const size = 30;

// Define a posição inicial da cobra
const initialPosition = { x: 270, y: 240 };

// Inicializa a cobra com a posição inicial
let snake = [initialPosition];

// Função para incrementar a pontuação
const incrementScore = () => {
  score.innerText = +score.innerText + 10;
};

// Função para gerar um número aleatório dentro de um intervalo
const randomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

// Função para gerar uma posição aleatória no grid
const randomPosition = () => {
  const number = randomNumber(0, canvas.width - size);
  return Math.round(number / 30) * 30;
};

// Função para gerar uma cor aleatória em RGB
const randomColor = () => {
  const red = randomNumber(0, 255);
  const green = randomNumber(0, 255);
  const blue = randomNumber(0, 255);

  return `rgb(${red}, ${green}, ${blue})`;
};

// Define as propriedades do objeto de comida
const food = {
  x: randomPosition(),
  y: randomPosition(),
  color: randomColor(),
};

// Variáveis para armazenar a direção e o ID do loop do jogo
let direction, loopId;

// função para densenhar a cmida na tela
const drawFood = () => {
  const { x, y, color } = food;

  ctx.shadowColor = color;
  ctx.shadowBlur = 6;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
  ctx.shadowBlur = 0;
};

// Função para desenhar a cobra na tela
const drawSnake = () => {
  ctx.fillStyle = "#ddd";

  snake.forEach((position, index) => {
    if (index == snake.length - 1) {
      ctx.fillStyle = "white";
    }

    ctx.fillRect(position.x, position.y, size, size);
  });
};

// Função para mover a cobra na direção especificada
const moveSnake = () => {
  if (!direction) return;

  const head = snake[snake.length - 1];

  if (direction == "right") {
    snake.push({ x: head.x + size, y: head.y });
  }

  if (direction == "left") {
    snake.push({ x: head.x - size, y: head.y });
  }

  if (direction == "down") {
    snake.push({ x: head.x, y: head.y + size });
  }

  if (direction == "up") {
    snake.push({ x: head.x, y: head.y - size });
  }

  snake.shift();
};

// Função para desenhar a grade do jogo na tela
const drawGrid = () => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#191919";

  for (let i = 30; i < canvas.width; i += 30) {
    ctx.beginPath();
    ctx.lineTo(i, 0);
    ctx.lineTo(i, 600);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineTo(0, i);
    ctx.lineTo(600, i);
    ctx.stroke();
  }
};

// função para verificar se a cobra comeu a comida
const checkEat = () => {
  const head = snake[snake.length - 1];

  if (head.x == food.x && head.y == food.y) {
    incrementScore();
    snake.push(head);
    audio.play();

    let x = randomPosition();
    let y = randomPosition();

    while (snake.find((position) => position.x == x && position.y == y)) {
      x = randomPosition();
      y = randomPosition();
    }

    food.x = x;
    food.y = y;
    food.color = randomColor();
  }
};

/*Essa função basicamente verifica se houve uma colisão da cabeça da cobra com as paredes do canvas 
ou com o próprio corpo, e toma uma ação adequada (encerrando o jogo) caso uma colisão seja detectada.*/

const checkCollision = () => {
  const head = snake[snake.length - 1];
  const canvasLimit = canvas.width - size;
  const neckIndex = snake.length - 2;

  const wallCollision =
    head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

  const selfCollision = snake.find((position, index) => {
    return index < neckIndex && position.x == head.x && position.y == head.y;
  });

  if (wallCollision || selfCollision) {
    gameOver();
  }
};

// Função para encerrar o jogo
const gameOver = () => {
  direction = undefined;

  menu.style.display = "flex";
  finalScore.innerText = score.innerText;
  canvas.style.filter = "blur(2px)";
};

// Função principal do loop do jogo
const gameLoop = () => {
  clearInterval(loopId);

  ctx.clearRect(0, 0, 600, 600);
  drawGrid();
  drawFood();
  moveSnake();
  drawSnake();
  checkEat();
  checkCollision();

  loopId = setTimeout(() => {
    gameLoop();
  }, 250);
};

// Inicia o loop do jogo
gameLoop();

// Evento de escuta do teclado para capturar as teclas de direção
document.addEventListener("keydown", ({ key }) => {
  if (key == "ArrowRight" && direction != "left") {
    direction = "right";
  }

  if (key == "ArrowLeft" && direction != "right") {
    direction = "left";
  }

  if (key == "ArrowDown" && direction != "up") {
    direction = "down";
  }

  if (key == "ArrowUp" && direction != "down") {
    direction = "up";
  }
});

// Evento de clique no botão de jogar novamente
buttonPlay.addEventListener("click", () => {
  score.innerText = "00";
  menu.style.display = "none";
  canvas.style.filter = "none";

  snake = [initialPosition];
});
