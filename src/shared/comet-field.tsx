import React, { useMemo } from "react";
import styles from "./comet-field.module.css";

interface CometFieldProps {
  /** How many comets shoot across this section. */
  count?: number;
  /** Seconds between shots for a given comet (lower = more frequent). */
  cycleSeconds?: number;
}

// A background layer of auto-looping shooting stars, meant to sit behind a
// section's real content (see comet-field.module.css: it's absolutely
// positioned with a negative z-index, so the section it's dropped into
// must have position: relative for the stacking to clip/layer correctly).
const CometField: React.FC<CometFieldProps> = ({ count = 2, cycleSeconds = 9 }) => {
  const comets = useMemo(
    () =>
      Array.from({ length: count }, () => {
        // Vary the travel angle (measured clockwise from the positive
        // x-axis, in CSS's y-down coordinate system) so comets don't all
        // streak along the exact same line.
        const angleDeg = 122 + Math.random() * 26; // roughly down-and-left
        const angleRad = (angleDeg * Math.PI) / 180;
        const distance = 55 + Math.random() * 20;
        const dx = `${(distance * Math.cos(angleRad)).toFixed(1)}vw`;
        const dy = `${(distance * Math.sin(angleRad)).toFixed(1)}vh`;
        const scale = (0.7 + Math.random() * 0.6).toFixed(2);
        const durationJitter = cycleSeconds * (0.85 + Math.random() * 0.3);

        return {
          top: `${Math.random() * 55}%`,
          left: `${50 + Math.random() * 45}%`,
          delay: `${(Math.random() * cycleSeconds).toFixed(2)}s`,
          duration: `${durationJitter.toFixed(2)}s`,
          dx,
          dy,
          rot: `${(angleDeg - 180).toFixed(1)}deg`,
          scale,
        };
      }),
    [count, cycleSeconds]
  );

  return (
    <div className={styles.field} aria-hidden="true">
      {comets.map((comet, index) => (
        <span
          key={index}
          className={styles.comet}
          style={
            {
              top: comet.top,
              left: comet.left,
              animationDuration: comet.duration,
              animationDelay: comet.delay,
              "--comet-dx": comet.dx,
              "--comet-dy": comet.dy,
              "--comet-rot": comet.rot,
              "--comet-scale": comet.scale,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};

export default CometField;
