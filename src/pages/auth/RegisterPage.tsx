import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import "./LoginPage.css";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3001/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed",
        );
      }

      // После регистрации автоматически авторизуем пользователя
      await login(email, password);

      // Редирект в зависимости от роли
      const userRole = data.data.user?.role;
      let redirectUrl = '/';
      
      switch (userRole) {
        case 'User':
          redirectUrl = '/';
          break;
        case 'Operator':
          redirectUrl = '/operator';
          break;
        case 'Admin':
          redirectUrl = '/admin';
          break;
        case 'Courier':
          redirectUrl = '/courier';
          break;
        default:
          redirectUrl = '/';
      }

      navigate(redirectUrl);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Registration failed";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__container">
        <div className="login-page__header">
          <h1>KTrust Logistics</h1>
          <p>CRM Система</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="login-page__form"
        >
          <h2>Регистрация</h2>

          {error && (
            <div className="login-page__error">
              {error}
            </div>
          )}

          <div className="login-page__form-group">
            <label htmlFor="fullName">
              Полное имя
            </label>

            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              required
              placeholder="Введите ваше полное имя"
            />
          </div>

          <div className="login-page__form-group">
            <label htmlFor="email">
              Email
            </label>

            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              placeholder="Введите ваш email"
            />
          </div>

          <div className="login-page__form-group">
            <label htmlFor="password">
              Пароль
            </label>

            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              minLength={8}
              placeholder="Введите пароль (минимум 8 символов)"
            />
          </div>

          <button
            type="submit"
            className="login-page__submit-btn"
            disabled={loading}
          >
            {loading
              ? "Регистрация..."
              : "Зарегистрироваться"}
          </button>
        </form>

        <div className="login-page__footer">
          <p>
            Уже есть аккаунт?{" "}
            <Link to="/login">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
