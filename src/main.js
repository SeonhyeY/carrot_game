'use strict';
/** Game Fields Setting
 * Place carrots and bugs randomly in .field when the game__btn is clicked
 */
const CARROT_SIZE = 80;
const CARROT_COUNT = 5;
const BUG_COUNT = 5;
const GAME_PLAY_TIME = 5;

// elements in header.game__header
const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();
const startBtn = document.querySelector('.game__btn');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');
// elements in section.pop=up
const popUp = document.querySelector('.pop-up');
const popUpRefresh = document.querySelector('.pop-up__refresh');
const popUpText = document.querySelector('.pop-up__message');

let timer = undefined;
let started = false;
let score = 0;

startBtn.addEventListener('click', () => {
  if (started) {
    stopGame();
  } else {
    startGame();
  }
});

popUpRefresh.addEventListener('click', () => {
  startGame();
  hidePopUp();
});

field.addEventListener('click', onFieldClick);

function startGame() {
  started = true;
  initGame();
  showStopBtn();
  showTimerAndScore();
  startGameTimer();
}

function stopGame() {
  started = false;
  stopGameTimer();
  hideGameBtn();
  showPopUpWithText('Replay?');
}

function finishGame(win) {
  started = false;
  hideGameBtn();
  stopGameTimer();
  showPopUpWithText(win ? '🎊You Won🎊' : 'Game Over💩');
}

function showTimerAndScore() {
  gameTimer.style.visibility = 'visible';
  gameScore.style.visibility = 'visible';
}

function updateScoreBoard() {
  gameScore.innerText = CARROT_COUNT - score;
}

function startGameTimer() {
  let remainGameTime = GAME_PLAY_TIME;
  updateTimerText(remainGameTime);
  timer = setInterval(() => {
    if (remainGameTime <= 0) {
      clearInterval(timer);
      finishGame(score === CARROT_COUNT);
      return;
    }
    updateTimerText(--remainGameTime);
  }, 1000);
}

function updateTimerText(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  if (seconds < 10) {
    gameTimer.innerHTML = `0${minutes}:0${seconds}`;
  } else {
    gameTimer.innerHTML = `0${minutes}:${seconds}`;
  }
}

function stopGameTimer() {
  clearInterval(timer);
}

function showStopBtn() {
  const icon = document.querySelector('.fa-solid');
  icon.classList.add('fa-stop');
  icon.classList.remove('fa-play');
  startBtn.style.visibility = 'visible';
}

function hideGameBtn() {
  startBtn.style.visibility = 'hidden';
}

function showPopUpWithText(text) {
  popUpText.innerText = text;
  popUp.classList.remove('pop-up--hidden');
}

function hidePopUp() {
  popUp.classList.add('pop-up--hidden');
}

function initGame() {
  field.innerHTML = '';
  score = 0;
  gameScore.innerText = CARROT_COUNT;
  addItem('carrot', CARROT_COUNT, 'img/carrot.png');
  addItem('bug', BUG_COUNT, 'img/bug.png');
}

function onFieldClick(event) {
  if (!started) {
    return;
  }
  const target = event.target;
  if (target.matches('.carrot')) {
    target.remove();
    score++;
    updateScoreBoard();
    if (score === CARROT_COUNT) {
      finishGame(true);
    }
  } else if (target.matches('.bug')) {
    finishGame(false);
  }
}

function addItem(className, count, imgPath) {
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - CARROT_SIZE;
  const y2 = fieldRect.height - CARROT_SIZE;

  for (let i = 0; i < count; i++) {
    const item = document.createElement('img');

    item.setAttribute('class', className);
    item.setAttribute('src', imgPath);
    item.style.position = 'absolute';

    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);

    item.style.left = `${x}px`;
    item.style.top = `${y}px`;

    field.appendChild(item);
  }
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
