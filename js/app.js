document.addEventListener("DOMContentLoaded", function (e) {
  const gamePlayBtn = document.querySelector(".btn-start");
  const gameOverBtn = document.querySelector(".game-over__btn");
  const gameInfo = document.querySelector('.game-info__score');
  let gameInfoCount = document.querySelector('.game-info__count');
  let gameInfoScoreCount = document.querySelector('.game-over__score-count');
  const title = document.getElementsByTagName("title");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  let cell = 15; // Размер ячейки
  let speed = 1000; // Скорость движения змейки
  let score = 0; // Счет
  let stop = true;

  let width = canvas.width;
  let height = canvas.height;

  let snake = {
    // Начальные координаты змейки:
    x: 0,
    y: 270,

    dx: cell,
    dy: 0,

    cells: [],
    maxCells: 4,
  };

  // еда:
  let apple = {
    // Координаты:
    x: 150,
    y: 150,
  };

  // Генератор случайных чисел в заданном диапазоне:
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  // ------------- Игровая логика -------------
  if (localStorage.getItem('record') === null) {
    localStorage.setItem('record', '0');
  }

  function gameOver() {
    cancelAnimationFrame(stopGame);
    stop = false;
    document.querySelector('.game-over').style.display = 'flex';
    gameInfoScoreCount.textContent = gameInfoCount.textContent;
    title[0].textContent = 'Game Over'
  }

  function getFood() {
    apple.x = getRandomInt(0, 40) * cell;
    apple.y = getRandomInt(0, 40) * cell;
  };

  // Движение змейки:
  function moveSnake() {
    if (!stop) return false;
    snake.x += snake.dx;
    snake.y += snake.dy;
      
    if (snake.x < 0) {
      snake.x = canvas.width - cell;
    } else if (snake.x > canvas.width) {
      snake.x = 0;
    }

    if (snake.y < 0) {
      snake.y = canvas.height - cell;
    } else if (snake.y > canvas.height) {
      snake.y = 0;
    }

    // Змейка есть еду:
    if (snake.x === apple.x && snake.y === apple.y) {
      ++score;
      gameInfoCount.textContent = score;
    }

    // Добавим тело змейки в массив:
    snake.cells.unshift({x: snake.x, y: snake.y});

    // Удаляем последний элемент:
    if (snake.cells.length > snake.maxCells) {
      snake.cells.pop();
    }

    // Рисуем змейку:
    ctx.clearRect(0, 0, width, height); // Обнуляем canvas

    snake.cells.forEach(function(item, index) {
      ctx.fillStyle = 'red';
      ctx.fillRect(item.x, item.y, cell - 1, cell - 1);
      // Проверка столкновения змейки с собой:
      for (let i = index + 1; i < snake.cells.length; i++) {
        if (item.x === snake.cells[i].x && item.y === snake.cells[i].y) {
          gameOver();
        }
      }
    })

    if (snake.x === apple.x && snake.y === apple.y) {
      apple.x = getRandomInt(0, 40) * cell;
      apple.y = getRandomInt(0, 40) * cell;
      snake.maxCells++;
    }

    if (gameInfoCount.textContent > localStorage.getItem('record')) {
      document.querySelector('.game-info__record').style.display = 'block';
      let count =  gameInfoCount.textContent;
      localStorage.setItem('record', count);
      document.querySelector('.game-over__record').style.display = 'block';
    }
  };

  function core() {
    stopGame = requestAnimationFrame(core); // Рекурсивно запускаем core()

    // На каком элементе сейчас фокус:
    // var element = document.querySelector(":focus");
    // console.log(element);

    // Рисуем еду:
    ctx.fillStyle = 'green';
    ctx.fillRect(apple.x, apple.y, cell - 1, cell - 1);    
  };

  // START:
  gamePlayBtn.addEventListener('click', function(){
    this.setAttribute('disabled', 'disabled');
    this.setAttribute('title', 'Идет игра...');
    this.style.cursor = 'not-allowed';
    this.textContent = 'playing';
    title[0].textContent = 'Идет игра...';

    gamePlayBtn.blur(); // Снимаем фокус с кнопки старта

    getFood();

    setInterval(() => {
      moveSnake();
    }, speed);

    stopGame = requestAnimationFrame(core);
  });

  // Вернуться к игре:
  gameOverBtn.addEventListener('click', function(){
    document.querySelector('.game-over').style.display = 'none';
    location.href = location.href;
  });

  // Обработаем нажатия:
  document.addEventListener("keydown", function(e) {
    if (e.code === "ArrowUp" && snake.dy === 0) {
      document.querySelector(".row__arrow--up").classList.add("row__arrow--pressed");
      snake.dy -= cell;
      snake.dx = 0;
    }
    if (e.code === "ArrowLeft" && snake.dx === 0) {
      document.querySelector(".row__arrow--left").classList.add("row__arrow--pressed");
      snake.dx -= cell;
      snake.dy = 0;
    }
    if (e.code === "ArrowRight" && snake.dx === 0) {
      document.querySelector(".row__arrow--right").classList.add("row__arrow--pressed");
      snake.dx += cell;
      snake.dy = 0;
    }
    if (e.code === "ArrowDown" && snake.dy === 0) {
      document.querySelector(".row__arrow--bottom").classList.add("row__arrow--pressed");
      snake.dy += cell;
      snake.dx = 0;
    }
  }); // Нажатие клавиши

  document.addEventListener("keyup", function(e) {
    if (e.code === "ArrowUp") {
      document.querySelector(".row__arrow--up").classList.remove("row__arrow--pressed");
    }
    if (e.code === "ArrowLeft") {
      document.querySelector(".row__arrow--left").classList.remove("row__arrow--pressed");
    }
    if (e.code === "ArrowRight") {
      document.querySelector(".row__arrow--right").classList.remove("row__arrow--pressed");
    }
    if (e.code === "ArrowDown") {
      document.querySelector(".row__arrow--bottom").classList.remove("row__arrow--pressed");
    }
  }); // "Отпускание" клавиши  

  
}); // Конец DOMContentLoaded
