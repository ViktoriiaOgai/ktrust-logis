import { Link } from "react-router-dom";
import "@/components/ui/MenuPopover/MenuPopover.css";
import Insta from "@/assets/icons/Insta.svg?react";
import WhatsApp from "@/assets/icons/WhatsApp.svg?react";
import Telegram from "@/assets/icons/Telegram.svg?react";

type Item = {
  title: string;
  href?: string;
};

type Contact = {
  label: string;
  value: string;
};

type Props = {
  variant: "header" | "footer";
  sections: {
    title: string;
    items: Item[];
  }[];
  contacts?: Contact[];
  onClose?: () => void;
};

export default function MenuPopover({
  variant,
  sections,
  contacts,
  onClose,
}: Props) {
  return (
    <>
      {variant === "header" && (
        <div
          className="menu-overlay"
          onClick={onClose}
        />
      )}

     <div
  className={`menu-popover ${variant}`}
  onClick={(e) => e.stopPropagation()}
>
  <div className="menu-popover__content">
    
    <div className="menu-columns">

      {sections.map((section) => (
        <div key={section.title} className="menu-column">
          <h4>{section.title}</h4>

          {section.items.map((item) => (
            <Link
              key={item.title}
              to={item.href ?? "#"}
            >
              {item.title}
            </Link>
          ))}
          
        </div>
        
      ))}

      {variant === "footer" && contacts && (
        <div className="menu-column contacts">
          <h4>Контакты</h4>

          {contacts.map((contact) => (
            <div
              key={contact.label}
              className="contact-item"
            >
              <strong>{contact.label}</strong>
              <p>{contact.value}</p>
            </div>
          ))}
        </div>
      )}

    </div>
     {variant === "header" && (
      <div className="own">
        <p className="own-p">
          Ⓒ 2025 Все права защищены.
          <br />
          K-TRUST LOGIS
        </p>

        <div className="net-icons">
          <Insta />
          <WhatsApp />
          <Telegram />
        </div>
      </div>
    )}

  </div>
 
</div>
    </>
  );
}