/**
 * Audio wiring for the demo, kept declarative so it is easy to tune:
 *
 * - `backgroundByScreen` maps a screen coordinate (`"cx,cy"`) to an ambient
 *   bed id; every other screen falls back to `defaultBackground`.
 * - `footstepSequence` is cycled one step per `stepInterval` seconds while the
 *   player walks, so a footfall rhythm emerges from movement.
 * - `campfireSound` is a looping, distance-attenuated emitter attached to each
 *   lit campfire (swells as the player approaches, silent far away).
 *
 * Ids reference `assets/audio/experiment00.audio.project.json`.
 */
export const AUDIO = {
  projectUrl: '/assets/audio/experiment00.audio.project.json',
  ambientFade: 1.2,
  defaultBackground: 'bg_sewers',
  backgroundByScreen: {
    '0,0': 'bg_cantgoon',
    '0,1': 'bg_cantgoon',
    '0,2': 'bg_cantgoon',
    '0,3': 'bg_cantgoon',
    '0,7': 'bg_cantgoon',
    '0,8': 'bg_end',
    '1,8': 'bg_cantgoon',
    '1,9': 'bg_finalpath',
    '2,8': 'bg_withouttrace',
    '-1,7': 'bg_ceilingstars',
    '-3,8': 'bg_ceilingstars',
    '-3,9': 'bg_down',
  } as Record<string, string>,
  footstepSequence: 'seq_footsteps_water',
  stepInterval: 0.32,
  stepVolume: 0.1,
  campfireSound: 'campfire_loop',
  campfireVolume: 0.2,
} as const;
