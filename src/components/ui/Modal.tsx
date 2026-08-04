import { useState, useRef, useEffect } from "react";
import OrderButton from "@/components/ui/OrderButton";
import "@/components/ui/Modal.css";

// Иконки
import PhoneIcon from "@/assets/icons/phone.svg?react";
import TelegramIcon from "@/assets/icons/telegram.svg?react";
import WhatsappIcon from "@/assets/icons/whatsapp.svg?react";
import Down from "@/assets/icons/chevron-down.svg?react";

interface ModalProps {
  isOpen?: boolean;
  title: string;
  message: string;
  buttonText?: string;
  onClose?: () => void;
  onAccept?: () => void;
  onCancel?: () => void;
}

type ContactMethod = "phone" | "whatsapp" | "telegram";

// Словарь стран с ISO-кодами для картинок флагов
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
  buttonText = "Отправить",
  onClose,
  onAccept,
  onCancel,
}: ModalProps) {
  const [contactMethod, setContactMethod] = useState<ContactMethod>("phone");
  const [isCountrySelectorOpen, setIsCountrySelectorOpen] = useState(false);
  const countrySelectorRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    comment: "",
    contact: "",
    currentCountryCode: "+7",
  });

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  // Находим объект выбранной страны
  const currentCountry =
    COUNTRY_LIST.find((c) => c.code === formData.currentCountryCode) || COUNTRY_LIST[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {onClose && (
          <button type="button" className="modal-close-outer" onClick={onClose}>
            ✕
          </button>
        )}

        <div className="modal">
          <h3>{title}</h3>
          <p>{message}</p>

          {/* --- ФОРМА --- */}
          <div className="modal-form">
            <div className="input-group">
              <input
                type="text"
                placeholder="Ваше имя"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                placeholder="Комментарий или детали заказа"
                value={formData.comment}
                onChange={(e) => handleInputChange("comment", e.target.value)}
              />
            </div>

            {/* Способы связи */}
            <div className="contact-methods">
              <button
                type="button"
                className={`method-btn ${contactMethod === "phone" ? "active" : ""}`}
                onClick={() => setContactMethod("phone")}
              >
                <PhoneIcon /> Телефон
              </button>
              <button
                type="button"
                className={`method-btn ${contactMethod === "telegram" ? "active" : ""}`}
                onClick={() => setContactMethod("telegram")}
              >
                <TelegramIcon /> Telegram
              </button>
              <button
                type="button"
                className={`method-btn ${contactMethod === "whatsapp" ? "active" : ""}`}
                onClick={() => setContactMethod("whatsapp")}
              >
                <WhatsappIcon /> WhatsApp
              </button>
            </div>

            {/* Ввод номера с выбором страны */}
            <div className="input-group dynamic-contact combined-input">
              {(contactMethod === "phone" || contactMethod === "whatsapp") && (
                <div className="country-selector-wrapper" ref={countrySelectorRef}>
                  <button
                    type="button"
                    className="country-select-trigger"
                    onClick={() => setIsCountrySelectorOpen(!isCountrySelectorOpen)}
                  >
                    {/* Рендерим тег img с ссылкой на флаг по ISO */}
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
                          onClick={() => handleCountrySelect(country.code)}
                        >
                          <img
                            src={`https://flagcdn.com/w40/${country.iso}.png`}
                            alt={country.name}
                            className="option-flag-img"
                          />
                          <span className="option-code">{country.code}</span>
                          <span className="option-name">{country.name}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <input
                type="text"
                placeholder={getContactPlaceholder()}
                value={formData.contact}
                onChange={(e) => {
                  let value = e.target.value;
                  if (
                    (contactMethod === "phone" || contactMethod === "whatsapp") &&
                    !value.startsWith(formData.currentCountryCode) &&
                    value !== ""
                  ) {
                    value = formData.currentCountryCode + value;
                  }
                  handleInputChange("contact", value);
                }}
              />
            </div>
          </div>

          {/* --- КНОПКИ ДЕЙСТВИЯ --- */}
          <div className="modal-actions">
            {onAccept || onCancel ? (
              <>
                {onCancel && (
                  <OrderButton className="modal-cancel" onClick={onCancel}>
                    Отмена
                  </OrderButton>
                )}
                {onAccept && (
                  <OrderButton className="modal-accept" onClick={onAccept}>
                    Подтвердить
                  </OrderButton>
                )}
              </>
            ) : (
              <OrderButton onClick={onClose}>{buttonText}</OrderButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}