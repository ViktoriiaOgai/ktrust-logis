import { useState, useRef, useEffect } from "react";
import "@/components/ui/Modal.css";
import OrderButton from "@/components/ui/OrderButton";
import { operatorService } from "@/services/operatorService";


// Иконки
import PhoneIcon from "@/assets/icons/phone.svg?react";
import TelegramIcon from "@/assets/icons/Telegram.svg?react";
import WhatsappIcon from "@/assets/icons/WhatsApp.svg?react";
import Down from "@/assets/icons/chevron-down.svg?react";

interface ModalProps {
  isOpen?: boolean;
  title: string;
  message: string;
  buttonText?: string;
  className?: string;
  onButtonClick?: () => void;
  onClose?: () => void;
}

type ContactMethod = "phone" | "whatsapp" | "telegram";

// Список стран
const COUNTRY_LIST = [
  { code: "+7", iso: "ru", name: "Россия" },
  { code: "+7", iso: "kz", name: "Казахстан" },
  { code: "+82", iso: "kr", name: "Южная Корея" },
  { code: "+1", iso: "us", name: "США" },
  { code: "+996", iso: "kg", name: "Киргизия" },
  { code: "+998", iso: "uz", name: "Узбекистан" },
];

export default function Modal({
  isOpen = true,
  title,
  message,
  buttonText = "Отправить заявку",
  onClose,
}: ModalProps) {
  const [contactMethod, setContactMethod] =
    useState<ContactMethod>("phone");

  const [isCountrySelectorOpen, setIsCountrySelectorOpen] =
    useState(false);

  const countrySelectorRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    cargoName: "",
    contact: "",
    currentCountryCode: "+7",
  });

  const [operatorPhone, setOperatorPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Закрытие селектора стран при клике снаружи
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        countrySelectorRef.current &&
        !countrySelectorRef.current.contains(event.target as Node)
      ) {
        setIsCountrySelectorOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Загрузка телефона оператора при открытии модального окна
  useEffect(() => {
    async function fetchOperatorPhone() {
      try {
        const response = await operatorService.getActiveOperator();
        if (response.operator && response.operator.phone) {
          setOperatorPhone(response.operator.phone);
        }
      } catch (error) {
        console.error('Failed to fetch operator phone:', error);
      }
    }

    if (isOpen) {
      fetchOperatorPhone();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (
    field: keyof typeof formData,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCountrySelect = (countryCode: string) => {
    setFormData((prev) => ({
      ...prev,
      currentCountryCode: countryCode,
      contact: countryCode,
    }));

    setIsCountrySelectorOpen(false);
  };

  const getContactPlaceholder = () => {
    switch (contactMethod) {
      case "telegram":
        return "@username или +7 (999) 000-00-00";

      case "whatsapp":
        return "Номер WhatsApp";

      case "phone":
      default:
        return "Номер телефона";
    }
  };

  // Текущая выбранная страна
  const currentCountry =
    COUNTRY_LIST.find(
      (country) => country.code === formData.currentCountryCode,
    ) || COUNTRY_LIST[0];

  return (
    <div
      className="modal-container"
      onClick={(e) => e.stopPropagation()}
    >
      {onClose && (
      <button
        type="button"
        className="modal-close-outer"
        onClick={onClose}
        aria-label="Закрыть"
      >
        ✕
      </button>
      )}

      <div className="modal">
        <h3>{title}</h3>

        <p>{message}</p>

        {/* ФОРМА */}
        <div className="modal-form">
          {/* Имя */}
          <div className="input-group">
            <label
              htmlFor="recipient-name"
              className="input-label"
            >
              Ваше имя
            </label>

            <input
              id="recipient-name"
              type="text"
              placeholder="Введите"
              value={formData.name}
              onChange={(e) =>
                handleInputChange("name", e.target.value)
              }
            />
          </div>

          {/* Адрес получателя */}
          <div className="input-group">
            <label
              htmlFor="recipient-address"
              className="input-label"
            >
              Адрес получателя
            </label>

            <input
              id="recipient-address"
              type="text"
              placeholder="Введите"
              value={formData.address}
              onChange={(e) =>
                handleInputChange("address", e.target.value)
              }
            />
          </div>

          {/* Наименование груза */}
          <div className="input-group">
            <label
              htmlFor="cargo-name"
              className="input-label"
            >
              Наименование груза
            </label>

            <input
              id="cargo-name"
              type="text"
              placeholder="Введите"
              value={formData.cargoName}
              onChange={(e) =>
                handleInputChange("cargoName", e.target.value)
              }
            />
          </div>

          {/* Способ связи */}
          <div className="contact-methods-group">
            <label className="input-label">
              Как с вами связаться?
            </label>

            <div className="contact-methods">
              <button
                type="button"
                className={`method-btn ${
                  contactMethod === "phone" ? "active" : ""
                }`}
                onClick={() => setContactMethod("phone")}
              >
                <PhoneIcon />
                Телефон
              </button>

              <button
                type="button"
                className={`method-btn ${
                  contactMethod === "telegram" ? "active" : ""
                }`}
                onClick={() => setContactMethod("telegram")}
              >
                <TelegramIcon />
                Telegram
              </button>

              <button
                type="button"
                className={`method-btn ${
                  contactMethod === "whatsapp" ? "active" : ""
                }`}
                onClick={() => setContactMethod("whatsapp")}
              >
                <WhatsappIcon />
                WhatsApp
              </button>
            </div>
          </div>

          {/* Контактные данные */}
          <div className="input-group dynamic-contact-group">
            <label
              htmlFor="contact"
              className="input-label"
            >
              Контактные данные
            </label>

            <div className="input-group dynamic-contact combined-input">
              {/* Выбор страны */}
              {(contactMethod === "phone" ||
                contactMethod === "whatsapp") && (
                <div
                  className="country-selector-wrapper"
                  ref={countrySelectorRef}
                >
                  <button
                    type="button"
                    className="country-select-trigger"
                    onClick={() =>
                      setIsCountrySelectorOpen(
                        !isCountrySelectorOpen,
                      )
                    }
                    aria-label="Выбрать страну"
                  >
                    <img
                      src={`https://flagcdn.com/w40/${currentCountry.iso}.png`}
                      alt={currentCountry.name}
                      className="selected-flag-img"
                    />

                    <Down className="arrow-icon" />
                  </button>

                  {isCountrySelectorOpen && (
                    <ul className="country-options-list">
                      {COUNTRY_LIST.map((country) => (
                        <li
                          key={`${country.code}-${country.name}`}
                          className="country-option"
                          onClick={() =>
                            handleCountrySelect(country.code)
                          }
                        >
                          <img
                            src={`https://flagcdn.com/w40/${country.iso}.png`}
                            alt={country.name}
                            className="option-flag-img"
                          />

                          <span className="option-code">
                            {country.code}
                          </span>

                          <span className="option-name">
                            {country.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <input
                id="contact"
                type="text"
                placeholder={getContactPlaceholder()}
                value={formData.contact}
                onChange={(e) => {
                  let value = e.target.value;

                  if (
                    (contactMethod === "phone" ||
                      contactMethod === "whatsapp") &&
                    !value.startsWith(
                      formData.currentCountryCode,
                    ) &&
                    value !== ""
                  ) {
                    value =
                      formData.currentCountryCode + value;
                  }

                  handleInputChange("contact", value);
                }}
              />
            </div>
          </div>
        </div>

        {/* КНОПКА */}
        <div className="modal-actions">
          <OrderButton
            className="order-btn"
            onClick={async () => {
              if (loading) return;

              // Валидация
              if (!formData.name || !formData.address || !formData.cargoName || !formData.contact) {
                alert('Пожалуйста, заполните все поля');
                return;
              }

              setLoading(true);

              try {
                const message = `
Новая заявка на доставку:
Имя: ${formData.name}
Адрес: ${formData.address}
Груз: ${formData.cargoName}
Контакт: ${formData.contact}
Способ связи: ${contactMethod}
                `.trim();

                // Если есть телефон оператора, формируем ссылку для связи
                if (operatorPhone) {
                  let contactUrl = '';

                  if (contactMethod === 'phone') {
                    contactUrl = `tel:${operatorPhone}`;
                  } else if (contactMethod === 'whatsapp') {
                    contactUrl = `https://wa.me/${operatorPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
                  } else if (contactMethod === 'telegram') {
                    contactUrl = `https://t.me/${operatorPhone.replace(/\D/g, '')}`;
                  }

                  if (contactUrl) {
                    window.open(contactUrl, '_blank');
                  }
                } else {
                  // Если нет оператора, показываем сообщение
                  alert('Извините, сейчас нет доступных операторов. Попробуйте позже.');
                  return;
                }

                // В реальном проекте здесь был бы API вызов для сохранения заявки:
                // await fetch('/api/requests', { method: 'POST', body: JSON.stringify({ ...formData, contactMethod }) });

                alert('Заявка отправлена! Менеджер свяжется с вами в ближайшее время.');
                onClose?.();
              } catch (error) {
                alert('Ошибка при отправке заявки. Попробуйте позже.');
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            {loading ? 'Отправка...' : buttonText}
          </OrderButton>
        </div>
      </div>
    </div>
  );
}
