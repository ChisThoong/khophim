"use client";
import { useState, useEffect, useRef } from "react";
import { Menu, Search, ChevronDown, X, Loader2 } from "lucide-react";
import MobileMenu from "./mobile-menu";
import Link from "next/link";
import Badge from "../global/badge";
import { cleanText } from "@/lib/cleanText";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<null | "theloai" | "quocgia">(null);
  const [scrolled, setScrolled] = useState(false);

  const theLoaiRef = useRef<HTMLDivElement>(null);
  const quocGiaRef = useRef<HTMLDivElement>(null);

  // search
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !theLoaiRef.current?.contains(target) &&
        !quocGiaRef.current?.contains(target)
      ) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Lắng nghe scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const delay = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/search?tag=${encodeURIComponent(query)}&per_page=5`);
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
        setShowDropdown(true);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [query]);


  
  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="max-full mx-auto flex items-center px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/">
            <img
              src="/images/logo.svg"
              alt="RoPhim Logo"
              className="h-10 w-auto cursor-pointer"
            />
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 w-full mx-8 max-w-3xl" ref={searchRef}>
            <div className="relative w-full">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm kiếm phim..."
                className="w-[400px] rounded-md bg-white/20 border border-transparent text-sm px-4 py-3 pl-10 text-white placeholder-gray-300 focus:outline-none focus:border-white/50"
              />
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              {query && (
                <button
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
                  onClick={() => setQuery("")}
                >
                  <X size={16} />
                </button>
              )}

              {/* Dropdown kết quả */}
              {showDropdown && (
                <div className="absolute mt-2 w-full bg-black/95 rounded-md shadow-lg ">
                 
                  {/* Loading */}
                  {loading && (
                    <div className="flex items-center justify-center py-6 text-gray-400">
                      <Loader2 className="h-5 w-5 mr-2 animate-spin text-gray-300" />
                      Đang tìm kiếm...
                    </div>
                  )}

                  {/* Results */}
                  {!loading && results.length > 0 && (
                    <>
                     <div className="p-3 text-sm text-gray-400">Danh sách phim</div>
                      {results.slice(0, 5).map((movie) => (
                        
                        <Link
                          key={movie.id}
                          href={`/movies/${movie.slug}`}
                          className="flex items-center gap-3 px-3 py-4 hover:bg-white/10 transition"
                          onClick={() => setShowDropdown(false)}
                        >
                          
                          <img
                            src={`https://img.ophim.live/uploads/movies/${movie.slug}-thumb.jpg`}
                            alt={movie.title}
                            className="w-14 h-20 object-cover rounded"
                          />
                          <div className="flex flex-col text-sm mt-1">
                            <span className="text-white font-medium">{cleanText(movie.title)}</span>
                            <span className="text-gray-400 text-xs line-clamp-1">
                              {(movie.meta?.ophim_original_title) || ""}
                            </span>
                            <div className="flex items-center gap-2 text-gray-400 text-xs ">
                              {movie.meta?.ophim_quality && <Badge variant="white" className = "p-0">{movie.meta.ophim_quality}</Badge>
}
                              {movie.meta?.ophim_year && <Badge variant="outline">{movie.meta.ophim_year}</Badge>
                            }
                              {movie.meta?.ophim_runtime && <Badge variant="outline">{movie.meta.ophim_runtime}</Badge>
                            }
                            </div>
                          </div>
                        </Link>
                      ))}

                      <Link
                        href={`/search?q=${encodeURIComponent(query)}`}
                        className="block text-center text-sm text-yellow-200 px-3 py-2 border-t border-gray-700"
                        onClick={() => setShowDropdown(false)}
                      >
                        Toàn bộ kết quả
                      </Link>
                    </>
                  )}

                  {/* Không có kết quả */}
                  {!loading && results.length === 0 && query.trim() && (
                    <div className="py-4 text-center text-sm text-gray-400">
                      Không tìm thấy kết quả
                    </div>
                  )}
                </div>
              )}

              {showDropdown && !loading && results.length === 0 && query.trim() && (
                <div className="absolute mt-2 w-full bg-black/95 border border-gray-700 rounded-md shadow-lg p-3 text-sm text-gray-400">
                  Không tìm thấy kết quả
                </div>
              )}
            </div>  
          </div>
        </div>

        {/* Menu desktop */}
        <nav className="hidden md:flex justify-start gap-12 text-sm font-[550] text-[14px] relative">
          {/* Thể loại dropdown */}
          <div className="relative" ref={theLoaiRef}>
            <button
              className="flex items-center gap-1 transition"
              onClick={() =>
                setOpenMenu(openMenu === "theloai" ? null : "theloai")
              }
            >
              Thể loại <ChevronDown size={16} className="text-white" />
            </button>
            {openMenu === "theloai" && (
              <div className="absolute left-0 mt-2 w-64 bg-black border border-gray-700 rounded-md shadow-lg p-4 grid grid-cols-2 gap-2">
                <a href="#" className="block px-3 py-2 hover:bg-white/10 rounded">
                  Hành động
                </a>
                <a href="#" className="block px-3 py-2 hover:bg-white/10 rounded">
                  Tình cảm
                </a>
                <a href="#" className="block px-3 py-2 hover:bg-white/10 rounded">
                  Hài hước
                </a>
              </div>
            )}
          </div>
          <a href="/phim-le" className="hover:text-yellow-400 transition">
            Phim lẻ
          </a>
          <a href="phim-bo" className="hover:text-yellow-400 transition">
            Phim bộ
          </a>
          <a href="hoat-hinh" className="hover:text-yellow-400 transition">
            Hoạt hình
          </a>
          <a href="phim-chieu-rap" className="hover:text-yellow-400 transition">
            Chiếu rạp
          </a>

          {/* Quốc gia dropdown */}
          <div className="relative" ref={quocGiaRef}>
            <button
              className="flex items-center gap-1 transition"
              onClick={() =>
                setOpenMenu(openMenu === "quocgia" ? null : "quocgia")
              }
            >
              Quốc gia <ChevronDown size={16} className="text-white" />
            </button>
            {openMenu === "quocgia" && (
              <div className="absolute left-0 mt-2 w-40 bg-black/90 border border-gray-700 rounded-md shadow-lg p-2">
                <a href="#" className="block px-3 py-2 hover:bg-white/10 rounded">
                  Việt Nam
                </a>
                <a href="#" className="block px-3 py-2 hover:bg-white/10 rounded">
                  Hàn Quốc
                </a>
                <a href="#" className="block px-3 py-2 hover:bg-white/10 rounded">
                  Mỹ
                </a>
              </div>
            )}
          </div>
        </nav>

        {/* Contact button */}
        <div className="hidden md:block ml-6 ml-auto">
          <a
            href="https://t.me/chisthong"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 border border-white/50 text-white px-4 py-2 rounded-md hover:bg-white/10 transition font-[550] text-[14px]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 240 240"
              className="w-5 h-5"
              fill="white"
            >
              <path d="M120,0C53.7,0,0,53.7,0,120s53.7,120,120,120s120-53.7,120-120S186.3,0,120,0z M175.3,82.3
              c-2.2,23.2-11.8,79.7-16.7,105.7c-2.1,11.3-6.7,15-11,15.4c-9.3,0.9-16.4-6.1-25.4-12c-14.1-9.3-22.1-15.1-36-24.2
              c-15.9-10.4-5.6-16.1,3.5-25.5c2.4-2.5,44-40.3,44.8-43.7c0.1-0.6-0.1-1.5-0.7-2.1c-0.5-0.6-1.4-0.9-2-0.7
              c-1.1,0.3-18.6,11.8-52.6,34.4c-5,3.4-9.5,5-13.5,4.9c-4.4-0.1-12.8-2.5-19-4.6c-7.6-2.5-13.7-3.8-13.2-8.1
              c0.3-2.2,3.3-4.5,9-6.9c35.5-15.5,59.1-25.8,70.8-31c33.7-15,40.7-17.6,45.3-17.6c1,0,3.3,0.2,4.8,1.4c1.2,1,1.5,2.3,1.6,3.2
              C175.5,80.1,175.4,81.2,175.3,82.3z"/>
            </svg>
            Liên hệ
          </a>
        </div>

        {/* Menu mobile toggle */}
        <button className="md:hidden ml-3" onClick={() => setOpen(!open)}>
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black px-6 py-4 space-y-3 border-t border-gray-800">
          <MobileMenu />
        </div>
      )}
    </header>
  );
}
