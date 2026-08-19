import Logo from "@/assets/icons/ktrustlogo.svg?react";
import OrderButton from "@/components/ui/OrderButton";
import Go from "@/assets/icons/go.svg?react";
import "@/components/layouts/Header/Header.css";
import { useState } from "react";
import MenuPopover from "@/components/ui/MenuPopover/MenuPopover";
import { headerSections} from "@/components/ui/MenuPopover/menuData";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [menuType, setMenuType] = useState<
    "services" | "about" | "contacts" | null
  >(null);
  const {logout, isAuthenticated, user} = useAuth();

  const handleLogout = () => {
    logout();
  };
 
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

            {isAuthenticated ? (
              <>
                {/* Для обычных пользователей (User) - показываем личный кабинет */}
                {user?.role === 'User' && (
                  <OrderButton className="order-btn" to="/">
                    Личный кабинет <Go />
                  </OrderButton>
                )}
                
                {/* Для операторов - ссылка на оператор панель */}
                {user?.role === 'Operator' && (
                  <OrderButton className="order-btn" to="/operator">
                    Панель оператора <Go />
                  </OrderButton>
                )}
                
                {/* Для админов - ссылка на админ панель */}
                {user?.role === 'Admin' && (
                  <OrderButton className="order-btn" to="/admin">
                    Админ панель <Go />
                  </OrderButton>
                )}
                
                {/* Для курьеров - ссылка на курьер панель */}
                {user?.role === 'Courier' && (
                  <OrderButton className="order-btn" to="/courier">
                    Панель курьера <Go />
                  </OrderButton>
                )}
                
                <OrderButton
                  className="menu-btn"
                  onClick={handleLogout}
                >
                  Выйти
                </OrderButton>
              </>
            ) : (
              <OrderButton className="order-btn" to="/login">
                Авторизация <Go />
              </OrderButton>
            )}
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