import { contacts } from "@/components/ui/MenuPopover/menuData";
import "@/components/layouts/Footer/Footer.css";

export default function FooterContacts() {
  return (
    <div className="footer-column">
      <h4>Контакты</h4>

      {contacts.map((contact) => (
        <div key={contact.label} className="contact-item">
          <strong>{contact.label}</strong>
          <p>{contact.value}</p>
        </div>
      ))}
    </div>
  );
}