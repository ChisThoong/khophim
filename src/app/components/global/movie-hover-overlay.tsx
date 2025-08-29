"use client";

import { Play, Heart, Info } from "lucide-react";
import Badge from "./badge";
import { GENRES_MAP } from "@/constants/genres";
import { useRouter } from "next/navigation";

interface MovieMeta {
    ophim_episode?: string[]; // ["Hoàn Tất (20/20)"]
    ophim_episode_list?: any[]; // chưa rõ chi tiết cấu trúc, nên để any[]
    ophim_fetch_info_url?: string[]; // ["https://ophim1.com/phim/..."]
    ophim_fetch_ophim_id?: string[]; // ["68a5e7830e6dc506bdff6526"]
    ophim_fetch_ophim_update_time?: string[]; // ["2025-08-20T22:19:41.000Z"]
    ophim_is_copyright?: string[];
    ophim_lang?: string[]; // ["Lồng Tiếng"]
    ophim_movie_formality?: string[]; // ["tv_series"]
    ophim_movie_status?: string[]; // ["completed"]
    ophim_original_title?: string[]; // ["Awfully Lawful"]
    ophim_poster_url?: string[]; // ["...-poster.jpg"]
    ophim_quality?: string[]; // ["HD"]
    ophim_rating?: string[];
    ophim_runtime?: string[]; // ["45 phút/tập"]
    ophim_showtime_movies?: string[];
    ophim_thumb_url?: string[]; // ["...-thumb.jpg"]
    ophim_total_episode?: string[]; // ["20 Tập"]
    ophim_trailer_url?: string[];
    ophim_view?: string[]; // ["64"]
    ophim_votes?: string[];
    ophim_year?: string[]; // ["2013"]
  }
  interface Movie {
    id: number;
    slug: string;
    link: string;
    title: string ;
    excerpt?: { rendered: string };
    imdb_rating?: number;
    year?: number;
    episode_current?: string;
    episode_total?: string;
    genres?: string[];
    country?: string[];
    meta?: MovieMeta;
    class_list:string []

  }

interface MovieHoverOverlayProps {
  movie: Movie;
  poster: string;
  isVisible: boolean;
  index?: number; 
}

export default function MovieHoverOverlay({ 
  movie, 
  poster, 
  isVisible, 
  index = 0 
}: MovieHoverOverlayProps) {
  const router = useRouter();
  if (!isVisible) return null;

 

  const handleWatchNow = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/movie/${movie.slug}`)
  };

  const handleAddToFavorites = (e: React.MouseEvent) => {
    e.preventDefault();
    // Add to favorites logic
    console.log('Added to favorites:', movie.title);
  };

  const handleShowDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    // Show details modal or page
    console.log('Show details for:', movie.title);
  };

  const genres =
  movie.class_list
    ?.filter((c: string) => c.startsWith("ophim_genres-"))
    .map((c: string) => c.replace("ophim_genres-", "")) || [];
  return (
    <div
      className={` rounded-2xl overflow-hidden transition-all duration-500 shadow-2xl  ${
        isVisible ? "" : ""
      }`}
      style={{ width: "450px" ,background: "linear-gradient(0deg, rgba(8, 45, 233, 0) 20%, rgba(40, 43, 58, 1)) ",}}
    >
      {/* Hình ảnh */}
      <div className="relative h-56 w-full">
        <img
          src={poster}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#2c3040] to-transparent pointer-events-none" />
    </div>

      {/* Thông tin */}
      <div className="relative bg-[#2c3040] p-6 space-y-4">
      <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-[#2c3040] to-transparent pointer-events-none rounded-t-xl" />

        <h3 className="text-white text-xl font-bold leading-tight">
          {movie.title}
        </h3>
        <p className="text-gray-300 text-base opacity-90">
          {movie.meta?.ophim_original_title}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleWatchNow}
            
            className="flex items-center gap-2 bg-gradient-to-tr from-[rgb(254,207,89)] to-[rgb(255,241,204)] 
                                text-black transition duration-300 transform 
                                hover:scale-110 hover:shadow-[0_0_40px_rgb(255,241,204)] px-6 py-3 rounded-lg font-bold transition-colors text-sm"
          >
            <Play className="w-5 h-5 fill-current" />
            Xem ngay
          </button>
        </div>

       
        <div className="flex flex-wrap gap-2">
          <Badge variant="white"> {movie.meta?.ophim_quality}</Badge>
          <Badge variant="default">{movie.meta?.ophim_lang}</Badge>
          <Badge variant="default">
             {movie.meta?.ophim_episode?.[0] === "Tập 0"
                ? "Full"
                : movie.meta?.ophim_episode?.[0] || "----"}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {genres.map((g: string) => (
            <Badge key={g} variant="outline">
                {GENRES_MAP[g] || g}
             </Badge>
             ))}
         
        </div>
      </div>
    </div>
  );
}