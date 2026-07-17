import "@/components/sections/InstagramSection.css";
type Props = {
  text: string;
  url: string;
};

export default function InstagramCard({ text, url }: Props) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="instagram-card"
    >
      <p>{text}</p>
    </a>
  );
}