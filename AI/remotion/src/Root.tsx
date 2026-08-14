import { Composition } from "remotion";
import { ConicalPendulum3D } from "./ConicalPendulum3D";
import "./index.css";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ConicalPendulum3D"
        component={ConicalPendulum3D}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          length: 3,
          mass: 1,
          gravity: 9.81,
          omegaStart: 2,
          omegaEnd: 4.2,
          durationSeconds: 12,
        }}
      />
    </>
  );
};
