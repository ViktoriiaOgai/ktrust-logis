import Logo from "@/assets/icons/ktrustlogo.svg?react";
import "@/components/layouts/Footer/Footer.css";

export default function FooterLogo() {
  return (
    <div className="footer-r">
    <div className="footer-logo">
        <Logo />
</div>
<div className="footer-logo-p">
      <p >
       Ⓒ 2025 Все права защищены.
       <br />
       K-TRUST LOGIS
       <br />
       <br />
       <br />
       Цены на сайте не являются офертой,
       <br />
       цены могут быть изменены.
      </p>
    </div>

    </div>
  );
}