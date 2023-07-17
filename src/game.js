'use strict';
import * as sound from './sound.js';
import { Field, ItemType } from './field.js';

export const Reason = Object.freeze({
  win: 'win',
  lose: 'lose',
  cancel: 'cancel',
});

// Builder Pattern
export class GameBuilder {
  withGameDuration(duration) {
    this.gameDuration = duration;
    return this;
  }

  withCarrotCount(num) {
    this.carrotCount = num;
    return this;
  }

  withBugCount(num) {
    this.bugCount = num;
    return this;
  }

  build() {
    return new Game(
      this.gameDuration, //
      this.carrotCount, //
      this.bugCount
    );
  }
}

class Game {
  constructor(playTime, carrotCount, bugCount) {
    this.playTime = playTime;
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;

    this.started = false;
    this.timer = undefined;
    this.score = 0;

    // DOM
    this.gameTimer = document.querySelector('.game__timer');
    this.gameScore = document.querySelector('.game__score');
    this.startBtn = document.querySelector('.game__btn');
    this.startBtn.addEventListener('click', () => {
      if (this.started) {
        this.stop(Reason.cancel);
      } else {
        this.start(Reason.win);
      }
    });

    this.gameField = new Field(carrotCount, bugCount);
    this.gameField.setClickListener(this.onItemClick);
  }

  setClickListenter(onGameClick) {
    this.onGameClick = onGameClick;
  }

  setGameStopListener(onGameStop) {
    this.onGameStop = onGameStop;
  }

  start() {
    this.started = true;
    this.initGame();
    this.showStopBtn();
    this.showTimerAndScore();
    this.startGameTimer();
    sound.playBg();
  }

  stop(reason) {
    this.started = false;
    this.stopGameTimer();
    this.hideStopBtn();
    sound.stopBg();
    this.onGameStop && this.onGameStop(reason);
  }

  onItemClick = (item) => {
    if (!this.started) {
      return;
    }
    if (item === ItemType.carrot) {
      this.score++;
      this.updateScoreBoard();
      if (this.score === this.carrotCount) {
        this.stop(Reason.win);
      }
    } else if (item === ItemType.bug) {
      this.stop(Reason.lose);
    }
  };

  showStopBtn() {
    const icon = this.startBtn.querySelector('.fa-solid');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
    this.startBtn.style.visibility = 'visible';
  }

  hideStopBtn() {
    this.startBtn.style.visibility = 'hidden';
  }

  showTimerAndScore() {
    this.gameTimer.style.visibility = 'visible';
    this.gameScore.style.visibility = 'visible';
  }

  updateScoreBoard() {
    this.gameScore.innerText = this.carrotCount - this.score;
  }

  startGameTimer() {
    let remainGameTime = this.playTime;
    this.updateTimerText(remainGameTime);
    this.timer = setInterval(() => {
      if (remainGameTime <= 0) {
        clearInterval(this.timer);
        this.stop(this.score === this.carrotCount ? Reason.win : Reason.lose);
        return;
      }
      this.updateTimerText(--remainGameTime);
    }, 1000);
  }

  updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    if (seconds < 10) {
      this.gameTimer.innerHTML = `0${minutes}:0${seconds}`;
    } else {
      this.gameTimer.innerHTML = `0${minutes}:${seconds}`;
    }
  }

  stopGameTimer() {
    clearInterval(this.timer);
  }

  initGame() {
    this.score = 0;
    this.gameScore.innerText = this.carrotCount;
    this.gameField.init();
  }
}
