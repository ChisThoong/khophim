"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; 

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const [inputPage, setInputPage] = useState(currentPage);

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
       <button
        disabled={currentPage <= 1}
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        className="p-2 rounded bg-gray-700 text-white disabled:opacity-50 hover:bg-gray-600 transition"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex items-center gap-2 text-gray-300">
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        
      </div>

      <button
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        className="p-2 rounded bg-gray-700 text-white disabled:opacity-50 hover:bg-gray-600 transition"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
