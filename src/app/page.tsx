import Image from "next/image";
import Navbar from "./components/navbar";
import MovieSlider from "./components/movie-slider";

export default function Home() {
  return (
    <main className=" min-h-screen text-white">
    <Navbar />
    <MovieSlider />
  </main>
  );
}
