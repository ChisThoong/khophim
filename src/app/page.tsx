import Image from "next/image";
import Navbar from "./components/layout/navbar";
import MovieSlider from "./components/home/movie-slider";
import RegionMovie from "./components/home/region-movie";


export default function Home() {
  return (
    <main className=" min-h-screen text-white bg-[#191b24]">
      {/* <Navbar /> */}
      <MovieSlider />
      <div className = "bg-[#191b24] p-6">
        <div className="px-6 py-6 space-y-2 rounded-xl" 
          style={{
          background: "linear-gradient(0deg, rgba(40, 43, 58, 0) 20%, rgba(40, 43, 58, 1)) ",
        }}>
          <RegionMovie
            region="trung-quoc"
            title="Phim Trung Quốc mới"
            limit={20}
            gradient="linear-gradient(235deg, #fff 30%,rgb(138, 51, 245) 130%)"
          />
          <RegionMovie
            region="han-quoc"
            title="Phim Hàn Quốc mới"
            limit={20}
            gradient="linear-gradient(235deg, #fff 30%, rgb(233, 213, 99) 130%)"
          />
          <RegionMovie
            region="au-my"
            title="Phim US-UK mới"
            limit={20}
            gradient="linear-gradient(235deg, #fff 30%, rgb(248, 89, 248) 130%)"
          />
        </div>
      </div>
      
    </main>
  );
}
