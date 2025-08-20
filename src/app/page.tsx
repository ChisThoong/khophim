import Image from "next/image";
import Navbar from "./components/navbar";
import MovieSlider from "./components/movie-slider";
import RegionMovie from "./components/region-movie";


export default function Home() {
  return (
    <main className=" min-h-screen text-white">
      <Navbar />
      <MovieSlider />
        <RegionMovie region="trung-quoc" title="Phim Trung Quốc mới" limit={10} />
    </main>
  );
}
