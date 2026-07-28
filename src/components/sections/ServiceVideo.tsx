import "@/components/sections/ServiceVideo.css"
interface ServiceVideoProps {
  src: string;
  title: string;
}

export default function ServiceVideo({
  src,
  title,
}: ServiceVideoProps) {
  return (
    <div className="service-video">
      <iframe
        src={src}
        title={title}
        frameBorder="0"
        allow="fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
      />
    </div>
  );
}