import Logo from "@/assets/icons/ktrustlogo.svg?react";
import OrderButton from "@/components/ui/OrderButton";
import Go from "@/assets/icons/go.svg?react";
import "@/components/layouts/Header/Header.css";
import { useState } from "react";
import MenuPopover from "@/components/ui/MenuPopover/MenuPopover";
import { headerSections} from "@/components/ui/MenuPopover/menuData";
import { Link } from "react-router-dom";

export default function Header() {
  const [menuType, setMenuType] = useState<
    "services" | "about" | "contacts" | null
  >(null);
 
  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <Link to="/" className="Btn-logo" >
      <Logo />
    </Link>
          </div>

          <div className="header-right">
            <OrderButton
              className="menu-btn"
              onClick={() => setMenuType("services")}
            >
              Услуги
            </OrderButton>

            <OrderButton
              className="menu-btn"
              onClick={() => setMenuType("about")}
            >
              О компании
            </OrderButton>

            <OrderButton
              className="menu-btn"
              onClick={() => setMenuType("contacts")}
            >
              Контакты
            </OrderButton>

            <OrderButton className="order-btn" to="/login">
              Авторизация <Go />
            </OrderButton>
          </div>
        </div>
      </header>

      {menuType && (
        <MenuPopover
  variant="header"
  sections={headerSections}
  onClose={() => setMenuType(null)}
/>
      )}</>
  );
}