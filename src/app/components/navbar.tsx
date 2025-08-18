"use client";
import { useState } from "react";
import { Menu, Search, ChevronDown, User } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full  z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src="/images/logo.svg"
            alt="RoPhim Logo"
            className="h-10 w-auto"
          />
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-xs mx-6">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Tìm kiếm phim..."
              className="w-full rounded-md bg-white/20 border border-transparent text-sm px-2 py-3 pl-10 text-white placeholder-gray-300 focus:outline-none focus:border-white/50"
              />
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Menu desktop */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <a href="#" className="hover:text-yellow-400 transition">Chủ đề</a>
          <a href="#" className="hover:text-yellow-400 transition">Thể loại</a>
          <a href="#" className="hover:text-yellow-400 transition">Phim lẻ</a>
          <a href="#" className="hover:text-yellow-400 transition">Phim bộ</a>
          <a href="#" className="hover:text-yellow-400 transition">Lịch chiếu</a>
        </nav>

        {/* User dropdown */}
        <div className="relative ml-6 hidden md:block">
          <button
            onClick={() => setUserOpen(!userOpen)}
            className="flex items-center gap-2 hover:text-yellow-400 transition"
          >
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <ChevronDown className="w-4 h-4" />
          </button>
          {userOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-[#111] rounded-md shadow-lg border border-gray-800 overflow-hidden">
              <a href="#" className="block px-4 py-2 hover:bg-gray-800">Yêu thích</a>
              <a href="#" className="block px-4 py-2 hover:bg-gray-800">Danh sách</a>
              <a href="#" className="block px-4 py-2 hover:bg-gray-800">Xem tiếp</a>
              <a href="#" className="block px-4 py-2 hover:bg-gray-800">Tài khoản</a>
              <a href="#" className="block px-4 py-2 text-red-400 hover:bg-gray-800">Đăng xuất</a>
            </div>
          )}
        </div>

        {/* Menu mobile toggle */}
        <button className="md:hidden ml-3" onClick={() => setOpen(!open)}>
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black px-6 py-4 space-y-3 border-t border-gray-800">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm phim..."
              className="w-full rounded-full bg-[#1a1a1a] border border-gray-700 text-sm px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
          <a href="#" className="block hover:text-yellow-400">Chủ đề</a>
          <a href="#" className="block hover:text-yellow-400">Thể loại</a>
          <a href="#" className="block hover:text-yellow-400">Phim lẻ</a>
          <a href="#" className="block hover:text-yellow-400">Phim bộ</a>
          <a href="#" className="block hover:text-yellow-400">Lịch chiếu</a>
          <hr className="border-gray-700" />
          <a href="#" className="block hover:text-yellow-400">Yêu thích</a>
          <a href="#" className="block hover:text-yellow-400">Danh sách</a>
          <a href="#" className="block hover:text-yellow-400">Xem tiếp</a>
          <a href="#" className="block hover:text-yellow-400">Tài khoản</a>
        </div>
      )}
    </header>
  );
}
