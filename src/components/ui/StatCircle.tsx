import { useEffect, useState } from "react";
import "@/components/ui/StatCircle.css";

interface Props {
  value: number;
  suffix?: string;
  label: string;
  progress: number;
}

export default function StatCircle({
  value,
  suffix = "",
  label,
  progress,
}: Props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
  const duration = 1800;
  const startTime = performance.now();

  let animationId: number;

  const animate = (time: number) => {
    const progress = Math.min((time - startTime) / duration, 1);

    setCount(Math.floor(progress * value));

    if (progress < 1) {
      animationId = requestAnimationFrame(animate);
    }
  };

  animationId = requestAnimationFrame(animate);

  return () => cancelAnimationFrame(animationId);
}, [value]);

  const radius = 80;

  const circumference = 2 * Math.PI * radius;

  const offset =
    circumference -
    (progress / 100) * circumference;

  return (
    <div className="stat-circle">
  <div className="stat-circle__wrapper">
    <svg width="170" height="170">
      <circle
        cx="85"
        cy="85"
        r={radius}
        className="circle-bg"
      />

      <circle
        cx="85"
        cy="85"
        r={radius}
        className="circle-progress"
        style={{
          strokeDasharray: circumference,
          strokeDashoffset: offset,
        }}
      />
    </svg>

    <div className="stat-circle__content">
      <h2>
        {count}
        {suffix}
      </h2>
    </div>
    <p className="stat-circle__label">
    {label}
  </p>
  </div>

  
</div>
  );
}