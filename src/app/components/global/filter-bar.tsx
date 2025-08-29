"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { CATEGORIES_MAP } from "@/constants/categories";
import { CountryMap } from "@/constants/countries";
import { GENRES_MAP } from "@/constants/genres";
import { Filter, X } from "lucide-react";

interface FilterBarProps {
  filters: {
    category: string;
    region: string;
    genre: string;
    year: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      category: string;
      region: string;
      genre: string;
      year: string;
    }>
  >;
  onApplyFilters?: (filters: {
    category: string;
    region: string;
    genre: string;
    year: string;
  }) => void; 
}

export default function FilterBar({ filters, setFilters }: FilterBarProps) {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const router = useRouter();
  const pathname = usePathname();

  const handleApply = () => {
    
    const currentCategory = pathname.includes("phim-le")
    ? "phim-le"
    : pathname.includes("phim-bo")
    ? "phim-bo"
    : pathname.includes("phim-chieu-rap")
    ? "phim-chieu-rap"
    : pathname.includes("hoat-hinh")
    ? "hoat-hinh"
    : "";
    if (localFilters.category && localFilters.category !== currentCategory) {
      const query = new URLSearchParams({
        ...localFilters,
      });
      router.push(`/${localFilters.category}?${query.toString()}`);
      return;
    }

    setFilters(localFilters);
    setOpen(false);
  };

  const handleClose = () => setOpen(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-900"
      >
        <Filter size={16} />
        <span className = "text-base font-bold">Bộ lọc</span>
      </button>

      {open && (
        <div className="mt-3 p-6 border border-gray-900/10 rounded-lg bg-[#1e1f29] space-y-4">
        {/* Categories */}
        <div className="flex flex-col gap-2">
          <span className="font-bold text-white">Loại phim:</span>
          <div className="flex flex-wrap gap-2 ">
            {Object.entries(CATEGORIES_MAP).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setLocalFilters(f => ({ ...f, category: key }))}
                className={`px-3 py-1 rounded-md  text-sm ${
                  localFilters.category === key ? " text-yellow-200 border border-gray-500" : " text-white hover:text-yellow-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      
        {/* Regions */}
        <div className="flex flex-col gap-2">
          <span className="font-bold text-white">Quốc gia:</span>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CountryMap).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setLocalFilters(f => ({ ...f, region: key }))}
                className={`px-3 py-1 rounded-md  text-sm ${
                  localFilters.region === key ? " text-yellow-200 border border-gray-500" : " text-white hover:text-yellow-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      
        {/* Genres */}
        <div className="">
          <span className="font-bold text-white">Thể loại:</span>
          <div className="flex flex-wrap gap-2">
            {Object.entries(GENRES_MAP).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setLocalFilters(f => ({ ...f, genre: key }))}
                className={`px-3 py-1 rounded-md  text-sm ${
                  localFilters.genre === key ? " text-yellow-200 border border-gray-500" : " text-white hover:text-yellow-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      
        {/* Year */}
        <div className="flex flex-col gap-2 w-64">
          <span className="font-bold text-white ">Năm:</span>
          <input
            type="number"
            placeholder="Ví dụ: 2025"
            value={localFilters.year}
            onChange={(e) =>
                setLocalFilters(f => ({ ...f, year: e.target.value }))
            }
            onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) {
                e.preventDefault(); // chặn nhập e, E, +, -
                }
            }}
            className="mt-1 px-4 py-2 rounded-md border border-gray-600 bg-[#1e1f29] text-white text-sm 
                        focus:outline-none focus:ring-0"
            />
        </div>
      
        {/* Buttons */}
        <div className="flex justify-start gap-2 mt-4">
            <button
                onClick={handleApply}
                className="flex items-center gap-2 bg-gradient-to-tr from-[rgb(254,207,89)] to-[rgb(255,241,204)] 
                text-black transition duration-300 transform 
                 hover:shadow-[0_0_40px_rgb(255,241,204)] px-4 py-3 rounded-lg font-bold transition-colors text-sm"
            >
                <Filter className="w-4 h-4" />
                Lọc kết quả
            </button>
            <button
                onClick={handleClose}
                className="flex items-center gap-1 px-4 py-3 rounded-md border border-gray-600 text-white hover:bg-gray-700 text-sm"
            >
                <X className="w-4 h-4" />
                Đóng
            </button>
            </div>
      </div>
      
      )}
    </div>
  );
}
