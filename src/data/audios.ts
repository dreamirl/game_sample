/**
 * @ContributorsList
 * @Inateno /  / http://dreamirl.com
 *
 * this is the audios list sample that will be loaded by the project
 * Please declare in the same way than this example.
 * To automatically preload a file just set "preload" to true.
 * you can use as many channels as you want
 */
const STD_MUSIC_PARAMS = {
  formats: ['mp3'],
  preload: true,
  loop: true,
  isMusic: true,
  channel: 'musics',
  volume: 0.8,
};

const STD_SFX_PARAMS = {
  formats: ['mp3'],
  preload: true,
  loop: false,
  isMusic: false,
  channel: 'sfx',
  volume: 0.8,
};
const audios = {
  masterVolume: 1,
  channels: {
    musics: 0.7,
    sfx: 0.9,
  },

  sounds: [
    // MUSICS
    {
      name: 'test_music',
      path: 'audio/test_music',
      ...STD_MUSIC_PARAMS,
    },

    {
      name: 'test_sprite_music',
      path: 'audio/test_music',
      ...STD_MUSIC_PARAMS,
      sprite: {
        _0: [0, 5000],
        _1: [10000, 20000],
      },
    },

    // FX
    {
      name: 'piew',
      path: 'audio/piew',
      ...STD_SFX_PARAMS,
      pool: 10,
    },
  ],
};

export default audios;
