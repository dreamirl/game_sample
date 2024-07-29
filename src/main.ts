import DE from '@dreamirl/dreamengine';

import Game from './Game';
import achievements from './data/achievements';
import audios from './data/audios';
import dictionary from './data/dictionary';
import images from './data/images';
import inputs from './data/inputs';

console.log('game main file loaded DREAM_ENGINE is:', DE);

export default function() {
  return DE.Platform.init({ images }, () => {
    DE.config.DEBUG = true;
    DE.config.DEBUG_LEVEL = 5;
    DE.init({
      onReady: Game.init,
      onLoad: Game.onload,
      inputs: inputs,
      audios: audios,
      dictionary: dictionary,
      images: images,
      achievements: achievements,
      about: {
        gameName: 'Engine Dev Game 1',
        namespace: 'noting',
        author: 'Inateno',
        gameVersion: '0.1',
      },
      saveModel: { nShoots: 0 },
      saveIgnoreVersion: true,
    });

    return Promise.resolve();
  }).catch((e) => console.error(e));
}
