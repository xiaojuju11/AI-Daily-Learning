export type ConicalPendulumProps = {
  length: number;
  mass: number;
  gravity: number;
  omegaStart: number;
  omegaEnd: number;
  durationSeconds: number;
};

export type PendulumState = {
  time: number;
  progress: number;
  omega: number;
  theta: number;
  radius: number;
  verticalDrop: number;
  tension: number;
  centripetalForce: number;
  period: number;
  phase: number;
  position: [number, number, number];
};

const smoothstep = (value: number) => value * value * (3 - 2 * value);

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export const getPendulumState = (
  time: number,
  props: ConicalPendulumProps,
): PendulumState => {
  const duration = Math.max(props.durationSeconds, 0.001);
  const progress = clamp(time / duration, 0, 1);
  const easedProgress = smoothstep(progress);
  const omega = props.omegaStart + (props.omegaEnd - props.omegaStart) * easedProgress;
  const minimumOmega = Math.sqrt(props.gravity / props.length) + 0.001;
  const safeOmega = Math.max(omega, minimumOmega);
  const cosTheta = clamp(props.gravity / (safeOmega * safeOmega * props.length), 0.05, 0.999);
  const theta = Math.acos(cosTheta);
  const radius = props.length * Math.sin(theta);
  const verticalDrop = props.length * cosTheta;
  const tension = (props.mass * props.gravity) / cosTheta;
  const centripetalForce = props.mass * safeOmega * safeOmega * radius;
  const period = (Math.PI * 2) / safeOmega;

  const omegaDelta = props.omegaEnd - props.omegaStart;
  const integratedSmoothstep = progress ** 3 - 0.5 * progress ** 4;
  const phase = props.omegaStart * time + omegaDelta * duration * integratedSmoothstep;

  return {
    time,
    progress,
    omega: safeOmega,
    theta,
    radius,
    verticalDrop,
    tension,
    centripetalForce,
    period,
    phase,
    position: [radius * Math.cos(phase), -verticalDrop, radius * Math.sin(phase)],
  };
};
