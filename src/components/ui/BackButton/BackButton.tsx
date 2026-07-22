import { useNavigate } from "react-router-dom";
import "./BackButton.css";

interface BackButtonProps {
  text?: string;
  className?: string;
}

export default function BackButton({
  text = "Назад",
  className = "",
}: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
  type="button"
  className={`back-button ${className}`}
  onClick={() => navigate(-1)}
>
  <span>←</span>
  <span>{text}</span>
</button>
  );
}