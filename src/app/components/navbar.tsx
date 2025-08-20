"use client";
import { useState, useEffect, useRef } from "react";
import { Menu, Search, ChevronDown } from "lucide-react";
import MobileMenu from "./mobile-menu";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<null | "theloai" | "quocgia">(null);

  const theLoaiRef = useRef<HTMLDivElement>(null);
  const quocGiaRef = useRef<HTMLDivElement>(null);

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

  return (
    <header className="fixed top-0 left-0 w-full z-50 mt-2">
      <div className="max-full mx-auto flex items-center  px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/images/logo.svg"
            alt="RoPhim Logo"
            className="h-10 w-auto"
          />
          <div className="hidden md:flex flex-1 w-full mx-8 max-w-3xl">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Tìm kiếm phim..."
                className="w-[400px] rounded-md bg-white/20 border border-transparent text-sm px-4 py-3 pl-10 text-white placeholder-gray-300 focus:outline-none focus:border-white/50"
              />
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Search desktop */}
        

        {/* Menu desktop */}
        <nav className="hidden md:flex justify-start gap-12 text-sm font-[550] text-[14px] relative">
          {/* Thể loại dropdown */}
          <div className="relative" ref={theLoaiRef}>
            <button
              className="flex items-center gap-1  transition"
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
          <a href="#" className="hover:text-yellow-400 transition">
            Phim lẻ
          </a>
          <a href="#" className="hover:text-yellow-400 transition">
            Phim bộ
          </a>
          <a href="#" className="hover:text-yellow-400 transition">
            Hoạt hình
          </a>
          <a href="#" className="hover:text-yellow-400 transition">
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
            {/* Telegram icon */}
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
