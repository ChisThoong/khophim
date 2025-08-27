"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieHoverOverlay from "../global/movie-hover-overlay";
import { motion, AnimatePresence } from "framer-motion";
import Badge from "../global/badge";

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

interface SessionMovieProps {
  region: string;
  title: string;
  limit?: number;
  gradient?: string;
}

export default function SessionMovie({ region, title, limit = 10, gradient }: SessionMovieProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null);
  const [hoveredMovieData, setHoveredMovieData] = useState<{
    movie: Movie;
    poster: string;
    index: number;
    position: { x: number; y: number };
  } | null>(null);

  const isHoveringOverlayRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch(`/api/get-movie-region?region=${region}&per_page=${limit}`);
        const data = await res.json();
        setMovies(data);
      } catch (error) {
        console.error("Lỗi khi load movies:", error);
      }
    }
    fetchMovies();
  }, [region, limit]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.children[0]?.clientWidth || 240;
      const gap = 16;
      const scrollAmount = (cardWidth + gap) * 2;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleMouseEnter = (movie: Movie, index: number, event: React.MouseEvent<HTMLDivElement>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      handleMouseLeave();
    }

    const poster = `https://img.ophim.live/uploads/movies/${movie.slug}-poster.jpg`;

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();

    const position = {
      x: rect.left + rect.width / 2 - 200,
      y: rect.top + rect.height / 2 - 200,
    };

    timeoutRef.current = setTimeout(() => {
      setHoveredMovie(movie.id);
      setHoveredMovieData({ movie, poster, index, position });
    },800);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  
    setTimeout(() => {
      if (!isHoveringOverlayRef.current) {
        setHoveredMovie(null);
        setHoveredMovieData(null);
      }
    }, 100); 
  };

  const handleOverlayMouseEnter = () => {
    isHoveringOverlayRef.current = true;
    if (hoveredMovieData) {
      setHoveredMovie(hoveredMovieData.movie.id);
    }
  };

  const handleOverlayMouseLeave = () => {
    isHoveringOverlayRef.current = false;
    setHoveredMovie(null);
    setHoveredMovieData(null);
  };

  return (
    <>
      <section className="flex gap-8 py-6 px-6 w-full relative z-0">
        {/* LEFT TITLE */}
        <div className="w-54 flex-shrink-0 flex flex-col justify-center">
          <div>
            <h2
              className="text-white mb-8"
              style={{
                background: `${gradient}`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "28px",
                fontWeight: 700,
                lineHeight: "1.2",
                letterSpacing: "1px",
              }}
            >
              {title}
            </h2>
          </div>
          <div>
            <Link
              href={`/region/${region}`}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
            >
              <span className="text-base">Xem tất cả</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* MOVIES LIST */}
        <div className="flex-1 relative w-54">
          {/* SCROLL BUTTON LEFT */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/3 -translate-y-1/2 z-20 p-3 bg-white rounded-full transition-all duration-200 shadow-lg"
            style={{ marginLeft: "-1.5rem" }}
          >
            <ChevronLeft className="text-black w-5 h-5" />
          </button>

          {/* CARDS */}
          <div className="overflow-visible w-full">
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
              style={{
                scrollSnapType: "x mandatory",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                maxWidth: "100%",
                display: "flex",
              }}
            >
              {movies.map((movie, index) => {
                const poster = `https://img.ophim.live/uploads/movies/${movie.slug}-poster.jpg`;
                return (
                  <div
                    key={movie.id}
                    className="flex-none snap-start w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 max-w-[280px] min-w-[200px] relative"
                  >
                    <div
                      className="rounded-xl group relative"
                      onMouseLeave={handleMouseLeave}
                      onMouseEnter={(e) => handleMouseEnter(movie, index, e)}
                    >
                      <a  href={`/movie/${movie.slug}`} target="_blank" rel="noopener noreferrer" className="block">
                        <div className="relative rounded-xl overflow-hidden">
                          <img
                            alt={movie.title}
                            src={poster}
                            className="w-full h-40 object-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = "https://picsum.photos/280/320";
                            }}
                          />
                        </div>
                        <div className="absolute bottom-2 left-2 flex gap-2 flex-wrap">
                          <Badge variant="default">{movie.meta?.ophim_quality?.[0] || "----"}</Badge>
                          <Badge variant="green">
                            {movie.meta?.ophim_episode?.[0] === "Tập 0"
                              ? "Full"
                              : movie.meta?.ophim_episode?.[0] || "----"}
                          </Badge>
                        </div>
                      </a>
                    </div>

                    <div className="p-4">
                      <h4 className="text-white text-md font-bold mb-2 line-clamp-2 leading-tight">
                        {movie.title}
                      </h4>
                      <p className="text-gray-400 text-sm truncate">
                        {movie?.meta?.ophim_original_title?.[0] || ""}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SCROLL BUTTON RIGHT */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/3 -translate-y-1/2 z-20 p-3 rounded-full transition-all duration-200 shadow-lg bg-white"
            style={{ marginRight: "-1.5rem" }}
          >
            <ChevronRight className="text-black w-5 h-5" />
          </button>
        </div>
      </section>

      <AnimatePresence>
        {hoveredMovieData && hoveredMovie === hoveredMovieData.movie.id && (
          <motion.div
            onMouseEnter={handleOverlayMouseEnter}
            onMouseLeave={handleOverlayMouseLeave}
            className="fixed pointer-events-auto z-[10000]"
            style={{
              left: `${hoveredMovieData.position.x}px`,
              top: `${hoveredMovieData.position.y}px`,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.75, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <MovieHoverOverlay
              movie={hoveredMovieData.movie}
              poster={hoveredMovieData.poster}
              isVisible={hoveredMovie !== null}
              index={hoveredMovieData.index}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
