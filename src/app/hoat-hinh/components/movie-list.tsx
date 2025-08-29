"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Badge from "@/app/components/global/badge";
import MovieHoverOverlay from "@/app/components/global/movie-hover-overlay";
import Pagination from "./pagination";

interface MovieMeta {
  ophim_original_title?: string[];
  ophim_quality?: string[];
  ophim_year?: string[];
  ophim_episode?: string[];
}

interface Movie {
  id: number;
  slug: string;
  title: string;
  link: string;
  class_list: string[];
  excerpt?: string;
  meta?: MovieMeta;
}

interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
}

interface MovieListProps {
  filters: {
    category: string;
    region: string;
    genre: string;
    year: string;
  };
  limit?: number;
  title?: string;
}

export default function MovieList({ filters, limit = 24, title }: MovieListProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);

  // Hover overlay
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null);
  const [hoveredMovieData, setHoveredMovieData] = useState<{
    movie: Movie;
    poster: string;
    index: number;
    position: { x: number; y: number };
  } | null>(null);

  const isHoveringOverlayRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset page khi filters thay đổi
useEffect(() => {
  setPage(1);
}, [filters]);

// Fetch movies khi filters, limit, page thay đổi
useEffect(() => {
  async function fetchMovies() {
    try {
      setLoading(true);

      const query: Record<string, string> = {
        per_page: String(limit),
        page: String(page),
      };

      if (filters.category) query.categories = filters.category;
      if (filters.region)   query.regions    = filters.region;
      if (filters.genre)    query.genres     = filters.genre;
      if (filters.year)     query.years      = filters.year;

      const queryString = new URLSearchParams(query).toString();
      const res = await fetch(`/api/movies?${queryString}`);
      const data = await res.json();

      setMovies(data.movies || []);
      setPagination(data.pagination || null);
    } catch (err) {
      console.error("Lỗi load movie:", err);
    } finally {
      setLoading(false);
    }
  }

  fetchMovies();
}, [filters, limit, page]);




  const handleMouseEnter = (
    movie: Movie,
    index: number,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
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
    }, 800);
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

  const cleanText = (text: string) =>
    text?.replace(/&#?[a-z0-9]+;/gi, "") || "";

  return (
    <section className="px-4 py-6 w-full">
      {title && (
        <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="w-full h-100 bg-gray-700 rounded-xl mb-3" />
              <div className="h-4 bg-gray-700 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {movies.map((movie, index) => {
              const poster = `https://img.ophim.live/uploads/movies/${movie.slug}-thumb.jpg`;

              return (
                <div
                  key={movie.id}
                  className="cursor-pointer"
                  onMouseEnter={(e) => handleMouseEnter(movie, index, e)}
                  onMouseLeave={handleMouseLeave}
                >
                  <a href={`/movie/${movie.slug}`} className="block group">
                    <div className="relative rounded-xl overflow-hidden">
                      <img
                        alt={movie.title}
                        src={poster}
                        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = "https://picsum.photos/280/320";
                        }}
                      />
                      <div className="absolute bottom-2 left-2 flex gap-2 flex-wrap">
                        <Badge variant="default">
                          {movie.meta?.ophim_quality?.[0] || "----"}
                        </Badge>
                        <Badge variant="green">
                          {movie.meta?.ophim_episode?.[0] === "Tập 0"
                            ? "Full"
                            : movie.meta?.ophim_episode?.[0] || "----"}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-2 text-white font-semibold text-sm line-clamp-2">
                      {cleanText(movie.title)}
                    </div>
                    <div className="mt-1 text-gray-400 font-light text-xs italic line-clamp-1">
                      {movie.meta?.ophim_original_title?.[0] || ""}
                    </div>
                  </a>
                </div>
              );
            })}
          </div>

          {pagination && pagination.total_pages > 1 && (
            <Pagination
              currentPage={pagination.current_page}
              totalPages={pagination.total_pages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          )}
        </>
      )}

      {/* Hover Overlay */}
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
              movie={hoveredMovieData.movie as any}
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
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}
