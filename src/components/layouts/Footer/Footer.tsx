import "@/components/layouts/Footer/Footer.css";

import FooterLogo from "@/components/layouts/Footer/FooterLogo";
import FooterContacts from "@/components/layouts/Footer/FooterContacts";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-left">
          <FooterLogo />
        </div>

        <div className="footer-right">
          <FooterContacts />
        </div>

      </div>
    </footer>
  );
}