import { Link } from "react-router-dom";
import "@/components/ui/OrderButton.css";
import "@/styles/Style.css"

type Props = {
  children: React.ReactNode;
  to?: string; // если нужно перейти
  type?: "button" | "submit";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;

};

export default function OrderButton({ 
  children, 
  to, 
  type = "button", 
  onClick, 
  className = "", 
disabled = false}: Props) {
  const classes = `Button ${className}`;
  // Если передан 'to', рендерим Link
  if (to) {
    return (
      <Link to={to} className={classes}>
        {children} 
      </Link>
    );
  }

  // Иначе обычная кнопка
  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={classes}
      disabled={disabled}
    >
      {children}
    </button>
  );
}