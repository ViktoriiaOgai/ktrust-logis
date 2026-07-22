import "@/components/layouts/Footer/Footer.css";

import FooterLogo from "@/components/layouts/Footer//FooterLogo";
import FooterNavigation from "@/components/layouts/Footer/FooterNavigation";
import FooterContacts from "@/components/layouts/Footer//FooterContacts";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <FooterLogo />

        <div className="footer-right">
      <FooterNavigation />
      <FooterContacts />
    </div>
      </div>
    </footer>
  );
}