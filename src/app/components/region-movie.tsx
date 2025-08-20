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
}

export default function SessionMovie({ region, title, limit = 10 }: SessionMovieProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
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

  // Check scroll position
  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const handleScroll = () => checkScrollButtons();
    
    if (scrollRef.current) {
      scrollRef.current.addEventListener('scroll', handleScroll);
      return () => {
        if (scrollRef.current) {
          scrollRef.current.removeEventListener('scroll', handleScroll);
        }
      };
    }
  }, [movies]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.clientWidth;
      const scrollAmount = containerWidth; // Scroll một container width
      
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      
      // Update button states after scroll
      setTimeout(checkScrollButtons, 300);
    }
  };

  return (
    <section className="flex gap-8 py-6 px-6">
      {/* Cột trái - Title và link */}
      <div className="w-64 flex-shrink-0 flex flex-col justify-between">
        <div>
          <h2
            className="text-white mb-6"
            style={{
              background: "linear-gradient(235deg, #fff 30%, #674196 130%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "2.5rem",
              fontWeight: 700,
              lineHeight: "1.2",
              letterSpacing: "0.5px",
            }}
          >
            {title}
          </h2>
        </div>
        
        <div className="mt-auto">
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
      <div className="flex-1 relative">
        {/* Nút scroll trái - chỉ hiện khi có thể scroll */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/70 hover:bg-black/90 rounded-full transition-all duration-200 shadow-lg opacity-80 hover:opacity-100"
            style={{ marginLeft: "-1.5rem" }}
          >
            <ChevronLeft className="text-white w-5 h-5" />
          </button>
        )}

        {/* Container carousel */}
        <div className="overflow-hidden">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{
              scrollSnapType: "x mandatory",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {movies.map((movie, index) => {
              const poster = `https://img.ophim.live/uploads/movies/${movie.slug}-poster.jpg`;

              return (
                <div
                  key={movie.id}
                  className="flex-none snap-start w-1/5 min-w-[200px]"
                >
                  <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
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
                            PĐ. {index + 1}
                          </div>
                          <div className="bg-green-600 text-white text-xs px-2 py-1 rounded font-bold shadow-md">
                            TM. {index + 1}
                          </div>
                        </div>

                        {/* Poster image */}
                        <div className="relative overflow-hidden">
                          <img
                            alt={movie.title.rendered}
                            src={poster}
                            className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
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
                </div>
              );
            })}
          </div>
        </div>

        {/* Nút scroll phải - chỉ hiện khi có thể scroll */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/70 hover:bg-black/90 rounded-full transition-all duration-200 shadow-lg opacity-80 hover:opacity-100"
            style={{ marginRight: "-1.5rem" }}
          >
            <ChevronRight className="text-white w-5 h-5" />
          </button>
        )}
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
        
        /* Fixed layout - always show 5 items per row */
        .flex-none {
          width: calc(20% - 0.8rem) !important; /* 5 items */
          min-width: 200px;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 1200px) {
          .flex-none {
            min-width: 180px;
          }
        }
        
        @media (max-width: 900px) {
          .flex-none {
            min-width: 160px;
          }
        }
      `}</style>
    </section>
  );
}