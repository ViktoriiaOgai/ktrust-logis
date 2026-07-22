import { Link } from "react-router-dom";
import { footerSections } from "@/components/ui/MenuPopover/menuData";
import "@/components/layouts/Footer/Footer.css";

export default function FooterNavigation() {
  return (
    <div className="footer-navigation">
      {footerSections.map((section) => (
        <div key={section.title} className="footer-column">
          <h4>{section.title}</h4>

          {section.items.map((item) => (
            <Link key={item.title} to={item.href ?? "#"}>
              {item.title}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}