import Image from "next/image";
import img404 from "../../media/404.webp";

export default function Home() {
  return (
    <main>
      <h1>404</h1>
      <p>The page you are looking for does not exist!</p>
      <Image
        src={img404}
        style={{ width: "100%", height: "auto" }}
        alt="Not Found Image"
      />
    </main>
  );
}
