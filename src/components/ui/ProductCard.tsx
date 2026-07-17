import { Link } from "react-router-dom";
import "@/components/ui/ProductCard.css";
import Go from "@/assets/icons/go.svg?react";

type Props = {
  image: string;
  title: string;
  to: string;
};

export default function ProductCard({
  image,
  title,
  to,
}: Props) {
  return (
    <Link
      to={to}
      className="product-card"
    >
      <img
        src={image}
        alt={title}
        className="product-card__image"
      />

      <div className="product-card__bottom">
  <span>{title}</span>
   <Go className="product-card__arrow" />
</div>
    </Link>
  );
}