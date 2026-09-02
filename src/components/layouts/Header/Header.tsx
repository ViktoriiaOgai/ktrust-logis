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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <Link to="/" className="Btn-logo" onClick={closeMobileMenu}>
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="header-right desktop-nav">
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

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Меню"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'mobile-menu--open' : ''}`}>
        <div className="mobile-menu__overlay" onClick={closeMobileMenu}></div>
        <div className="mobile-menu__content">
          <button className="mobile-menu__close" onClick={closeMobileMenu}>×</button>

          <nav className="mobile-menu__nav">
            <Link to="/" className="mobile-menu__link" onClick={closeMobileMenu}>Главная</Link>
            <button
              className="mobile-menu__link"
              onClick={() => {
                setMenuType("services");
                closeMobileMenu();
              }}
            >
              Услуги
            </button>
            <button
              className="mobile-menu__link"
              onClick={() => {
                setMenuType("about");
                closeMobileMenu();
              }}
            >
              О компании
            </button>
            <button
              className="mobile-menu__link"
              onClick={() => {
                setMenuType("contacts");
                closeMobileMenu();
              }}
            >
              Контакты
            </button>

            {isAuthenticated ? (
              <>
                {user?.role === 'User' && (
                  <Link to="/" className="mobile-menu__link" onClick={closeMobileMenu}>
                    Личный кабинет
                  </Link>
                )}
                {user?.role === 'Operator' && (
                  <Link to="/operator" className="mobile-menu__link" onClick={closeMobileMenu}>
                    Панель оператора
                  </Link>
                )}
                {user?.role === 'Admin' && (
                  <Link to="/admin" className="mobile-menu__link" onClick={closeMobileMenu}>
                    Админ панель
                  </Link>
                )}
                {user?.role === 'Courier' && (
                  <Link to="/courier" className="mobile-menu__link" onClick={closeMobileMenu}>
                    Панель курьера
                  </Link>
                )}
                <button onClick={handleLogout} className="mobile-menu__link mobile-menu__link--logout">
                  Выйти
                </button>
              </>
            ) : (
              <OrderButton
                to="/login"
                className="mobile-menu__btn"
                onClick={closeMobileMenu}
              >
                Авторизация
                <Go/>
              </OrderButton>
            )}
          </nav>
        </div>
      </div>

      {menuType && (
        <MenuPopover
  variant="header"
  sections={headerSections}
  onClose={() => setMenuType(null)}
/>
      )}</>
  );
}