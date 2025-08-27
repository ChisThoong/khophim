"use client";

import { useState } from "react";
import {
  X, Search, Bell, Heart, List, Play, User, LogOut,
  CreditCard, Plus, Download, ChevronDown
} from "lucide-react";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Nút mở menu */}
      <button
        className="md:hidden p-2"
        onClick={() => setOpen(true)}
      >
        <User className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar menu */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-[#273469] text-white z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <img src="/images/logo.svg" alt="RoPhim" className="h-8" />
            <span className="font-semibold">RoPhim</span>
          </div>
          <button onClick={() => setOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <span className="font-semibold">ThongNTC</span>
            <span className="text-yellow-400">∞</span>
          </div>
          <p className="text-xs text-gray-300 mt-1">
            Nâng cấp tài khoản <span className="font-semibold">RoX</span> để có trải nghiệm đẳng cấp hơn.
          </p>
          <button className="mt-3 w-full bg-yellow-400 hover:bg-yellow-500 text-black text-sm py-1.5 rounded-md transition">
            Nâng cấp ngay
          </button>
        </div>

        {/* Balance */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-gray-300" />
            <span>Số dư</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-medium">0 R</span>
            <button className="px-2 py-0.5 text-xs bg-gray-700 rounded hover:bg-gray-600 transition">
              + Nạp
            </button>
          </div>
        </div>

        {/* Menu items */}
        <div className="grid grid-cols-2 gap-2 p-4 border-b border-white/10">
          <button className="flex items-center gap-2 bg-white/5 rounded px-3 py-2 hover:bg-white/10">
            <Heart className="w-4 h-4" /> Yêu thích
          </button>
          <button className="flex items-center gap-2 bg-white/5 rounded px-3 py-2 hover:bg-white/10">
            <List className="w-4 h-4" /> Danh sách
          </button>
          <button className="flex items-center gap-2 bg-white/5 rounded px-3 py-2 hover:bg-white/10">
            <Play className="w-4 h-4" /> Xem tiếp
          </button>
          <button className="flex items-center gap-2 bg-white/5 rounded px-3 py-2 hover:bg-white/10">
            <User className="w-4 h-4" /> Tài khoản
          </button>
          <button className="flex items-center gap-2 bg-white/5 rounded px-3 py-2 col-span-2 hover:bg-white/10 text-red-400">
            <LogOut className="w-4 h-4" /> Thoát
          </button>
        </div>

        {/* App download */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2 bg-white/10 rounded p-3">
            <Download className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-xs">Tải ứng dụng</p>
              <p className="font-semibold">RoPhim</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-y-2 p-4 text-sm">
          <a href="#" className="hover:text-yellow-400">Chủ đề</a>
          <a href="#" className="hover:text-yellow-400 flex items-center gap-1">
            Thể loại <ChevronDown className="w-3 h-3" />
          </a>
          <a href="#" className="hover:text-yellow-400">Phim lẻ</a>
          <a href="#" className="hover:text-yellow-400">Phim bộ</a>
          <a href="#" className="hover:text-yellow-400">Xem chung</a>
          <a href="#" className="hover:text-yellow-400">Quốc gia</a>
          <a href="#" className="hover:text-yellow-400">Diễn viên</a>
          <a href="#" className="hover:text-yellow-400">Lịch chiếu</a>
          <a href="#" className="col-span-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded w-fit">
            NEW Rổ Bóng
          </a>
        </div>
      </div>
    </>
  );
}
