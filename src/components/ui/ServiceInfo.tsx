import "./ServiceInfo.css";
import Check from "@/assets/icons/check.svg?react";

interface ServiceInfoProps {
  title: string;
  description: string;
}

export default function ServiceInfo({
  title,
  description,
}: ServiceInfoProps) {
  return (
    <div className="service-info">
      <Check className="service-info__icon" />

      <div className="service-info__text">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}