import React from 'react';
import { useCallback } from 'react';
import { Container, Engine } from '@tsparticles/engine';
import { Particles } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export function MiningParticles() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="mining-particles"
      init={particlesInit}
      options={{
        particles: {
          number: {
            value: 50,
            density: {
              enable: true,
              value_area: 800,
            },
          },
          color: {
            value: '#FFD700',
          },
          shape: {
            type: 'circle',
          },
          opacity: {
            value: 0.7,
            random: true,
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 0.1,
              sync: false,
            },
          },
          size: {
            value: 3,
            random: true,
            animation: {
              enable: true,
              speed: 2,
              minimumValue: 0.1,
              sync: false,
            },
          },
          move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: true,
            straight: false,
            outModes: {
              default: 'bounce',
            },
          },
        },
        interactivity: {
          detectsOn: 'canvas',
          events: {
            onHover: {
              enable: true,
              mode: 'repulse',
            },
            resize: true,
          },
        },
        background: {
          color: {
            value: 'transparent',
          },
        },
      }}
    />
  );
}