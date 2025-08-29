"use client";

import { useState } from "react";
import FilterBar from "../components/global/filter-bar";
import MovieList from "./components/movie-list";

export default function PhimChieuRapPage() {
  const [filters, setFilters] = useState({
    category: "phim-chieu-rap",
    region: "",
    genre: "",
    year: "",
  });

  return (
    <div className="p-6 pt-40">
      <FilterBar
            filters={filters}
            setFilters={setFilters}
            onApplyFilters={(appliedFilters) => {
                // Kiểm tra category để redirect nếu cần
                const currentCategory = window.location.pathname.includes("phim-chieu-rap")
                ? "phim-le"
                : window.location.pathname.includes("phim-bo")
                ? "phim-bo"
                : window.location.pathname.includes("phim-chieu-rap")
                ? "phim-chieu-rap"
                : window.location.pathname.includes("hoat-hinh")
                ? "hoat-hinh"
                : "";

                if (appliedFilters.category && appliedFilters.category !== currentCategory) {
                const query = new URLSearchParams({
                    ...appliedFilters,
                });
                window.location.href = `/${appliedFilters.category}?${query.toString()}`;
                return;
                }

                // Cập nhật filter bình thường
                setFilters(appliedFilters);
            }}
            />

      <MovieList filters={filters} title="Phim chiếu rạp" />
    </div>
  );
}
