"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Movie {
  id: number;
  slug: string;
  link: string;
  title: { rendered: string };
  excerpt?: { rendered: string };
}

interface SessionMovieProps {
  region: string;
  title: string;
  limit?: number;
  gradient? : string;
}

export default function SessionMovie({ region, title, limit = 10, gradient }: SessionMovieProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      const gap = 16; // 1rem gap
      const scrollAmount = (cardWidth + gap) * 2; // Scroll by 2 cards
      
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="flex gap-8 py-6 px-6 w-full">
      {/* Cột trái - Title và link */}
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

      {/* Cột phải - Movie carousel */}
      <div className="flex-1 relative w-54">
        {/* Nút scroll trái */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/3 -translate-y-1/2 z-20 p-3 bg-white rounded-full transition-all duration-200 shadow-lg"
          style={{ marginLeft: "-1.5rem" }}
        >
          <ChevronLeft className="text-black w-5 h-5" />
        </button>

        {/* Container carousel with constrained width */}
        <div className="overflow-hidden w-full">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{
              scrollSnapType: "x mandatory",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              maxWidth: "100%", // Ensure it doesn't exceed parent width
              display: "flex",
            }}
          >
            {movies.map((movie, index) => {
              const poster = `https://img.ophim.live/uploads/movies/${movie.slug}-poster.jpg`;

              return (
                <div
                  key={movie.id}
                  className="flex-none snap-start w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 max-w-[280px] min-w-[200px]"
                >
                  <div className="bg-gray-900 rounded-xl overflow-hidden">
                    {/* Poster container */}
                    <div className="relative overflow-hidden">
                      <a
                        href={movie.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        {/* Badge episode/season info */}
                        <div className="absolute top-3 left-3 flex gap-2 z-10">
                          <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-bold shadow-md">
                            PĐ. {index + 4} {/* Adjusted to match image numbering */}
                          </div>
                          <div className="bg-green-600 text-white text-xs px-2 py-1 rounded font-bold shadow-md">
                            TM. {index + 4} {/* Adjusted to match image numbering */}
                          </div>
                        </div>

                        {/* Poster image */}
                        <div className="relative overflow-hidden">
                          <img
                            alt={movie.title.rendered}
                            src={poster}
                            className="w-full h-40 object-cover transition-transform duration-500 "
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/280x320/374151/9CA3AF?text=No+Image';
                            }}
                          />
                          
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </a>
                    </div>

                  </div>
                   {/* Movie info */}
                  <div className="p-4">
                      <h3 className="text-white text-base font-bold mb-2 line-clamp-2 leading-tight">
                        <a
                          href={movie.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={movie.title.rendered}
                          className="hover:text-purple-400 transition-colors"
                        >
                          {movie.title.rendered}
                        </a>
                      </h3>
                      <p className="text-gray-400 text-sm truncate">
                        {movie.slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                    </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Nút scroll phải */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/3 -translate-y-1/2 z-20 p-3 rounded-full transition-all duration-200 shadow-lg bg-white"
          style={{ marginRight: "-1.5rem" }}
        >
          <ChevronRight className="text-black w-5 h-5" />
        </button>
      </div>

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
        
        /* Responsive grid cho các breakpoints */
        @media (max-width: 640px) {
          .flex-none {
            width: calc(50% - 0.5rem) !important; /* 2 items */
          }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .flex-none {
            width: calc(33.333% - 0.667rem) !important; /* 3 items */
          }
        }
        @media (min-width: 1025px) {
          .flex-none {
            width: calc(20% - 0.8rem) !important; /* 5 items */
          }
        }
      `}</style>
    </section>
  );
}