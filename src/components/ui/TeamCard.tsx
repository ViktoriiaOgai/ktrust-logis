
import "@/components/ui/TeamCard.css";


type Props = {
  image?: string;
  label: string;
};

export default function TeamCard({
  image,
  label,
  
  
}: Props) {
  return (
    <div className="team-card">
      <img src={image} className="team-card__image"/>
    
      <p className="team__label">
    {label}
  </p>
  </div>
  );
}