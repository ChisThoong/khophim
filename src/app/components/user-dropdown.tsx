"use client";

import { useState } from "react";
import { ChevronDown, CreditCard, Heart, List, Play, User, LogOut } from "lucide-react";

export default function UserDropdown() {
  const [userOpen, setUserOpen] = useState(false);

  return (
    <div className="relative ml-6 hidden md:block">
      {/* Nút avatar */}
      <button
        onClick={() => setUserOpen(!userOpen)}
        className="flex items-center gap-2 transition"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden border border-white">
          <img
            src="https://www.rophim.me/images/avatars/pack1/14.jpg"
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Dropdown */}
      {userOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[#1b1d2a] rounded-md shadow-lg border border-gray-800 overflow-hidden text-sm z-50">
          
          {/* User info */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <span className="font-semibold">ThongNTC</span>
              <span className="text-yellow-400">∞</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Nâng cấp tài khoản RoX để có trải nghiệm đẳng cấp hơn.
            </p>
            <button className="mt-3 w-full bg-yellow-400 hover:bg-yellow-500 text-black text-sm py-1.5 rounded-md transition">
              Nâng cấp ngay
            </button>
          </div>

          {/* Balance */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gray-400" />
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
          <div className="py-2">
            <a href="#" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800">
              <Heart className="w-4 h-4 text-gray-400" /> Yêu thích
            </a>
            <a href="#" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800">
              <List className="w-4 h-4 text-gray-400" /> Danh sách
            </a>
            <a href="#" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800">
              <Play className="w-4 h-4 text-gray-400" /> Xem tiếp
            </a>
            <a href="#" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800">
              <User className="w-4 h-4 text-gray-400" /> Tài khoản
            </a>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-800">
            <a href="#" className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-gray-800">
              <LogOut className="w-4 h-4" /> Thoát
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
