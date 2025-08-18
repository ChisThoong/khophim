"use client";
import { useEffect, useState, useRef } from "react";

import "swiper/css";
import Image from "next/image";
import { Play, Heart, Info } from "lucide-react";
import { GENRES_MAP } from "@/constants/genres";
import { CATEGORIES_MAP } from "@/constants/categories";
import Badge from "./badge";
import { decode } from "he";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules"; 

import "swiper/css";
import "swiper/css/effect-fade"; 

export default function MovieSlider() {
  const swiperRef = useRef<any>(null);
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/get-movies-slider")
      .then((res) => res.json())
      .then((data) => setMovies(data));
  }, []);

//   if (movies.length === 0) {
//     return <div className="text-center text-gray-400">Đang tải phim...</div>;
//   }

  return (
    <div className="relative w-full h-[90vh]">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 4000 }}
        loop
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        className="w-full h-full"
      >
        {movies.map((m, idx) => {
          // lọc genres từ class_list
          const genres =
            m.class_list
              ?.filter((c: string) => c.startsWith("ophim_genres-"))
              .map((c: string) => c.replace("ophim_genres-", "")) || [];
          const categories =
            m.class_list
              ?.filter((c: string) => c.startsWith("ophim_categories-"))
              .map((c: string) => c.replace("ophim_categories-", "")) || [];
          return (
            <SwiperSlide key={m.id}>
              <div
                className="w-full h-full bg-cover bg-center relative flex items-center"
                style={{ backgroundImage: `url(${m.meta.ophim_poster_url[0]})` }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0)_0%,rgba(0,0,0,0.6)_70%,rgba(0,0,0,0.9)_100%)] bg-noise"></div>
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,rgba(0,0,0,0.6)_0.5px,transparent_0.5px)] [background-size:3px_3px]"></div>

                <div className="relative z-10 max-w-2xl px-10 text-white space-y-4">
                  {m.ophim_title_img ? (
                    <img
                      src={m.ophim_title_img}
                      alt={m.title}
                      className="object-contain"
                    />
                  ) : (
                    <h2 className="text-4xl font-extrabold">{m.title}</h2>
                  )}

                  <p className="text-yellow-500">
                    {m.meta.ophim_original_title?.[0]}
                  </p>
                  <p className="text-gray-300 max-w-xl">{m.desc}</p>

                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="yellow">{m.meta.ophim_quality?.[0]}</Badge>
                    <Badge variant="softYellow">{m.meta.ophim_year?.[0]}</Badge>
                    <Badge variant="outline">{m.meta.ophim_runtime?.[0]}</Badge>
                    <Badge variant="outline">{m.meta.ophim_episode?.[0]}</Badge>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {genres.map((g: string) => (
                      <Badge key={g} variant="transparent">
                        {GENRES_MAP[g] || g}
                      </Badge>
                    ))}
                    {categories.map((cat: string) => (
                      <Badge key={cat} variant="transparent">
                        {CATEGORIES_MAP[cat] || cat}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-white/80 leading-relaxed line-clamp-2">
                    {decode(m.excerpt || "")}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 mt-6">
                  <a
                    href={m.link}
                    className="w-18 h-18 flex items-center justify-center rounded-full 
                                bg-gradient-to-tr from-[rgb(254,207,89)] to-[rgb(255,241,204)] 
                                text-black transition duration-300 transform 
                                hover:scale-110 hover:shadow-[0_0_40px_rgb(255,241,204)]"
                    >
                    <Play className="w-6 h-6" />
                    </a>
                    {/* <button className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 text-white">
                      <Heart className="w-6 h-6" />
                    </button>
                    <button className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 text-white">
                      <Info className="w-6 h-6" />
                    </button> */}
                  </div>
                </div>

                {/* Thumbnail navigator */}
                <div className="absolute bottom-5 right-5 flex gap-3 z-20">
                  {movies.map((t, tIdx) => (
                    <div
                      key={t.id}
                      onClick={() => swiperRef.current?.slideToLoop(tIdx)}
                      className={`w-20 h-14 rounded-md overflow-hidden border-2 cursor-pointer transition 
                        ${
                          idx === tIdx
                            ? "border-yellow-500"
                            : "border-transparent hover:border-yellow-500"
                        }`}
                    >
                      <Image
                        src={t.meta.ophim_poster_url[0]}
                        alt={t.title}
                        width={160}
                        height={90}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}