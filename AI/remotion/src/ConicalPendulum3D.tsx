import { ThreeCanvas } from "@remotion/three";
import { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { ConicalPendulumProps, PendulumState, getPendulumState } from "./physics";

const pivot: [number, number, number] = [0, 1.75, 0];

const toScenePoint = (point: [number, number, number]): [number, number, number] => {
  return [point[0], point[1] + pivot[1], point[2]];
};

const vectorFrom = (point: [number, number, number]) => new THREE.Vector3(point[0], point[1], point[2]);

const format = (value: number, digits = 2) => value.toFixed(digits);

const LineSegment: React.FC<{
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  radius?: number;
  opacity?: number;
}> = ({ from, to, color, radius = 0.018, opacity = 1 }) => {
  const { midpoint, length, quaternion } = useMemo(() => {
    const start = vectorFrom(from);
    const end = vectorFrom(to);
    const direction = end.clone().sub(start);
    const segmentLength = direction.length();
    const segmentMidpoint = start.clone().add(end).multiplyScalar(0.5);
    const segmentQuaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.clone().normalize(),
    );

    return {
      midpoint: segmentMidpoint,
      length: segmentLength,
      quaternion: segmentQuaternion,
    };
  }, [from, to]);

  return (
    <mesh position={midpoint} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius, length, 24]} />
      <meshStandardMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
};

const ForceArrow: React.FC<{
  origin: [number, number, number];
  direction: [number, number, number];
  length: number;
  color: string;
}> = ({ origin, direction, length, color }) => {
  const dir = useMemo(() => vectorFrom(direction).normalize(), [direction]);
  const start = useMemo(() => vectorFrom(origin), [origin]);

  return <arrowHelper args={[dir, start, length, color, length * 0.24, length * 0.12]} />;
};

const PendulumScene: React.FC<{ state: PendulumState; props: ConicalPendulumProps }> = ({
  state,
  props,
}) => {
  const bob = toScenePoint(state.position);
  const axisBottom: [number, number, number] = [0, pivot[1] - props.length, 0];
  const ringY = pivot[1] - state.verticalDrop;
  const coneHeight = Math.max(state.verticalDrop, 0.001);
  const centeredConeY = pivot[1] - coneHeight / 2;
  const inwardDirection: [number, number, number] = [-state.position[0], 0, -state.position[2]];
  const tensionDirection: [number, number, number] = [
    pivot[0] - bob[0],
    pivot[1] - bob[1],
    pivot[2] - bob[2],
  ];

  return (
    <>
      <color attach="background" args={["#07111f"]} />
      <ambientLight intensity={0.72} />
      <directionalLight position={[4, 7, 5]} intensity={1.2} />
      <pointLight position={[-5, 4, -3]} intensity={0.5} color="#79d2ff" />

      <group rotation={[0.08, -0.46, 0]}>
        <mesh position={pivot}>
          <sphereGeometry args={[0.085, 32, 32]} />
          <meshStandardMaterial color="#f8fafc" emissive="#334155" emissiveIntensity={0.3} />
        </mesh>

        <LineSegment from={pivot} to={axisBottom} color="#64748b" radius={0.01} opacity={0.7} />
        <LineSegment from={pivot} to={bob} color="#e2e8f0" radius={0.018} />
        <LineSegment from={[0, ringY, 0]} to={bob} color="#38bdf8" radius={0.012} opacity={0.85} />

        <mesh position={[0, centeredConeY, 0]}>
          <coneGeometry args={[state.radius, coneHeight, 128, 1, true]} />
          <meshStandardMaterial
            color="#1d4ed8"
            opacity={0.16}
            transparent
            side={THREE.DoubleSide}
            roughness={0.8}
          />
        </mesh>

        <mesh position={[0, ringY, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[state.radius, 0.012, 12, 160]} />
          <meshStandardMaterial color="#22d3ee" emissive="#0891b2" emissiveIntensity={0.4} />
        </mesh>

        <mesh position={bob}>
          <sphereGeometry args={[0.18, 48, 48]} />
          <meshStandardMaterial
            color="#fb7185"
            emissive="#9f1239"
            emissiveIntensity={0.25}
            roughness={0.32}
            metalness={0.08}
          />
        </mesh>

        <ForceArrow origin={bob} direction={[0, -1, 0]} length={0.8} color="#facc15" />
        <ForceArrow origin={bob} direction={tensionDirection} length={1.05} color="#a78bfa" />
        <ForceArrow origin={bob} direction={inwardDirection} length={0.95} color="#34d399" />

        <mesh position={[0, -1.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[3.3, 128]} />
          <meshStandardMaterial color="#0f172a" transparent opacity={0.72} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </>
  );
};

const Metric: React.FC<{ label: string; value: string; unit: string }> = ({ label, value, unit }) => (
  <div className="metric">
    <span>{label}</span>
    <strong>{value}</strong>
    <em>{unit}</em>
  </div>
);

const Hud: React.FC<{ state: PendulumState; props: ConicalPendulumProps }> = ({ state, props }) => {
  const thetaDegrees = (state.theta * 180) / Math.PI;

  return (
    <AbsoluteFill className="hud">
      <section className="panel">
        <div className="eyebrow">Conical Pendulum 3D</div>
        <h1>omega(t) increasing</h1>
        <div className="metrics">
          <Metric label="omega" value={format(state.omega)} unit="rad/s" />
          <Metric label="theta" value={format(thetaDegrees, 1)} unit="deg" />
          <Metric label="radius" value={format(state.radius)} unit="m" />
          <Metric label="tension" value={format(state.tension)} unit="N" />
          <Metric label="Fc" value={format(state.centripetalForce)} unit="N" />
          <Metric label="period" value={format(state.period)} unit="s" />
        </div>
        <div className="formulas">
          <span>cos(theta) = g / (omega^2 L)</span>
          <span>r = L sin(theta)</span>
          <span>Fc = m omega^2 r</span>
        </div>
      </section>

      <section className="forceLegend">
        <span className="swatch gravity" /> mg downward
        <span className="swatch tension" /> T along string
        <span className="swatch centripetal" /> Fc toward axis
      </section>

      <section className="timeline">
        <div className="timeRow">
          <span>{format(state.time, 1)}s</span>
          <span>
            L={format(props.length, 1)}m, m={format(props.mass, 1)}kg, g={format(props.gravity, 2)}m/s^2
          </span>
          <span>{format(props.durationSeconds, 1)}s</span>
        </div>
        <div className="track">
          <div className="fill" style={{ width: `${state.progress * 100}%` }} />
        </div>
      </section>
    </AbsoluteFill>
  );
};

export const ConicalPendulum3D: React.FC<ConicalPendulumProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const time = frame / fps;
  const state = getPendulumState(time, props);
  const cameraIntro = interpolate(frame, [0, fps * 2], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="composition">
      <ThreeCanvas
        width={width}
        height={height}
        camera={{
          position: [0, 2.1 + (1 - cameraIntro) * 0.6, 6.6],
          fov: 38,
          near: 0.1,
          far: 100,
        }}
      >
        <PendulumScene state={state} props={props} />
      </ThreeCanvas>
      <Hud state={state} props={props} />
    </AbsoluteFill>
  );
};
