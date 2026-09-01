type Props = {
  className?: string;
  color?: string;
};

/** Decorative wave divider — used as a section transition to evoke the ocean. */
export function OceanWave({ className, color = "currentColor" }: Props) {
  return (
    <svg
      viewBox="0 0 1200 80"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M0,32 C150,72 350,0 600,32 C850,64 1050,8 1200,32 L1200,80 L0,80 Z"
        fill={color}
      />
    </svg>
  );
}
