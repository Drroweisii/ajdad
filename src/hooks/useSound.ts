import { useCallback, useEffect, useRef } from 'react';
import { Howl } from 'howler';

const SOUNDS = {
  click: new Howl({ src: ['/sounds/click.mp3'], volume: 0.5 }),
  coin: new Howl({ src: ['/sounds/coin.mp3'], volume: 0.3 }),
  upgrade: new Howl({ src: ['/sounds/upgrade.mp3'], volume: 0.4 }),
  purchase: new Howl({ src: ['/sounds/purchase.mp3'], volume: 0.4 }),
};

export function useSound() {
  const enabled = useRef(false);

  useEffect(() => {
    enabled.current = localStorage.getItem('soundEnabled') !== 'false';
  }, []);

  const toggleSound = useCallback(() => {
    enabled.current = !enabled.current;
    localStorage.setItem('soundEnabled', enabled.current.toString());
  }, []);

  const play = useCallback((sound: keyof typeof SOUNDS) => {
    if (enabled.current && SOUNDS[sound]) {
      SOUNDS[sound].play();
    }
  }, []);

  return { enabled: enabled.current, toggleSound, play };
}