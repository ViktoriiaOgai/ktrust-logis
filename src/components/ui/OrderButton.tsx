import { Link } from "react-router-dom";
import "@/components/ui/OrderButton.css";
import "@/styles/Style.css"

type Props = {
  children: React.ReactNode;
  to?: string; // если нужно перейти
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;

};

export default function OrderButton({ 
  children, 
  to, 
  type = "button", 
  onClick, 
  className = "" }: Props) {
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
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
