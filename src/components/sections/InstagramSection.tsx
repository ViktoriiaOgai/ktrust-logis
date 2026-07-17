import InstagramCard from "@/components/ui/InstagramCard";
import { instagramPosts } from "@/components/sections/instagramData";
import "@/components/sections/InstagramSection.css";
export default function InstagramSection() {
     return (
        <>
<section className="instagram">
    <div className="instagram__header">
        <h2>
            Следите за актуальными
            <br />
            акциями в нашем
            <br />
            инстаграме
        </h2>
    </div>

    <div className="instagram__posts">
  {instagramPosts.map((post, index) => (
    <InstagramCard
      key={index}
      text={post.text}
      url={post.url}
    />
  ))}
</div>
</section>
</>
     )
}