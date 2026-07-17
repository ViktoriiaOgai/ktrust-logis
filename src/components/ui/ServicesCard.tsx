import { Link } from "react-router-dom";
import OrderButton from "@/components/ui/OrderButton";
import "@/components/ui/ServicesCard.css";

type Props = {
  image: string;
  title: string;
  description: string;
  buttonText: string;
  to: string;
};

export default function ServicesCard({
  image,
  title,
  description,
  buttonText,
  to,
}: Props) {
  return (
    <div className="service-card">
        <Link
          to={to}>
      <img
        src={image}
        alt={title}
        className="service-card__image"
      />
       </Link>

      <div className="service-card__content">
        <h3>{title}</h3>

        <p>{description}</p>

        <OrderButton className="service-card__button">
      {buttonText}
    </OrderButton>
       
      </div>
    </div>
  );
}