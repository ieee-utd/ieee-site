import styles from "./skeleton.module.css";

interface SkeletonProps {
  className?: string;
}

/**
 * A grey shimmering placeholder block. It fills its positioned parent
 * (position: absolute; inset: 0), so drop it as a sibling inside a box that
 * already sizes/clips the real content — an image wrapper with
 * position: relative, for example — and it covers the same area until the
 * real content is ready to swap in.
 */
const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <span
    className={`${styles.skeleton} ${className ? className : ""}`}
    aria-hidden="true"
  />
);

export default Skeleton;
