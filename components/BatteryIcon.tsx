type BatteryIconProps = {
  className?: string;
};

export function BatteryIcon({ className }: BatteryIconProps) {
  return (
    <svg
      className={className}
      width="22"
      height="10"
      viewBox="0 0 22 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="0.5"
        y="1.5"
        width="18"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeOpacity={0.85}
      />
      <path
        d="M19.5 3.5h1.2c.4 0 .8.3.8.8v1.4c0 .4-.3.8-.8.8H19.5"
        stroke="currentColor"
        strokeOpacity={0.85}
        strokeLinecap="round"
      />
      <rect x="2" y="3" width="13" height="4" rx="0.5" fill="currentColor" fillOpacity={0.9} />
    </svg>
  );
}
