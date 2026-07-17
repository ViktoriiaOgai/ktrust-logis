import "@/components/layouts/Footer/Footer.css";

import MenuPopover from "@/components/ui/MenuPopover/MenuPopover";
import {
  footerSections,
  contacts,
} from "@/components/ui/MenuPopover/menuData";

export default function FooterContacts() {
  return (
    <>
      <MenuPopover
        variant="footer"
        sections={footerSections}
        contacts={contacts}
      />
    </>
  );
}