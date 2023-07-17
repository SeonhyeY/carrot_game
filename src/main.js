'use strict';

import { GameBuilder, Reason } from './game.js';
import PopUp from './popup.js';
import * as sound from './sound.js';

const gameFinishBanner = new PopUp();
const game = new GameBuilder()
  .withGameDuration(5)
  .withCarrotCount(3)
  .withBugCount(3)
  .build();

game.setGameStopListener((reason) => {
  let message;
  switch (reason) {
    case Reason.win:
      message = 'You won🎊';
      sound.playWin();
      break;
    case Reason.lose:
      message = 'Game Over💩';
      sound.playBug();
      break;
    case Reason.cancel:
      message = 'Replay❓';
      sound.playAlert();
      break;
    default:
      throw new Error('not valid reason');
  }
  gameFinishBanner.showWithText(message);
});

gameFinishBanner.setClickListener(() => {
  game.start();
});
