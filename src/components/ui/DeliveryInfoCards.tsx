
import "@/components/ui/DeliveryInfoCard.css";
import OrderButton from "@/components/ui/OrderButton";
import Icon from "@/assets/icons/icon.svg?react";

type Props = {
  icon: React.ReactNode;
  title: string;
  description: string;
  info: string;
  buttonText: string;
  buttonText2: string;
};

export default function DeliveryInfoCard({
  icon,
  title,
  description,
  info,
  buttonText,
  buttonText2

}: Props) {
  const content = (
    <>
      <div className="delivery-card__icon">
        {icon}
      </div>

      <div className="delivery-card__content">
        <p>{description}</p>
        <h3>{title}</h3>
        <div className="delivery-card__actions">
  <div className="delivery-card__top-row">
    <OrderButton className="delivery-card__button">
      <Icon />
      {buttonText}
    </OrderButton>

    <OrderButton className="delivery-card__button2">
      {buttonText2}
    </OrderButton>
  </div>

  <p className="delivery-card__info">{info}</p>
</div>
      </div>
    </>
  );

  
  return <div className="delivery-card">{content}</div>;
}