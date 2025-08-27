"use client";
import Image from "next/image";
import { useState } from "react";
import { Play, Heart, Plus, Share, MessageCircle, Star, Flame, Server, CheckCircle } from "lucide-react";
import { unserialize } from 'php-serialize';
import { GENRES_MAP } from "@/constants/genres";
import Badge from "../global/badge";
import { cleanText } from "@/lib/cleanText";
import { LoaderCircle } from "lucide-react";
import { CountryMap } from "@/constants/countries";
import { useRouter } from "next/navigation";

interface Episode {
  number: number;
  title: string;
  duration?: string;
  isWatched?: boolean;
  link_m3u8?: string;
  link_embed?: string;
}

interface Movie {
  title: string;
  originTitle: string;
  poster?: string;
  thump?: string;
  backdrop?: string;
  rating?: number;
  imdbRating?: number;
  year?: string;
  tags?: string[];
  genres?: string[];
  description?: string;
  episodes?: string;
  episodes_list?: Episode[];
}

interface MovieDetailProps {
  movie: any; 
}

const MovieDetail = ({ movie }: MovieDetailProps) => {
  const [activeTab, setActiveTab] = useState("Tập phim");
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();
  const slug = movie?.slug; 

  const poster = movie.poster || movie.meta?.ophim_poster_url?.[0] || "/api/placeholder/200/300";
  const thumb = movie.poster || movie.meta?.ophim_thumb_url?.[0] || "/api/placeholder/200/300";
  const backdrop = movie.backdrop || movie.meta?.ophim_backdrop_url?.[0] || poster;
  const year = movie.year || movie.meta?.ophim_year?.[0] || "";
  const rating = movie.rating || movie.meta?.ophim_rating?.[0] || null;
  const imdbRating = movie.imdbRating || null;
  const tags = movie.tags?.length ? movie.tags : movie.meta?.tags?.[0]?.split(",") || [];
  
  const description = movie.content || "";
  const originTitle = movie.meta?.ophim_original_title?.[0] || ""
  const genres: string[] =
  movie.class_list
    ?.filter((c: string) => c.startsWith("ophim_genres-"))
    .map((c: string) => c.replace("ophim_genres-", "")) || [];


  const countrySlug =
    movie.class_list?.find((c: string) => c.startsWith("ophim_regions-"))
      ?.replace("ophim_regions-", "") || "";
  
  const country = CountryMap[countrySlug] || "";

  // const episodes_list: Episode[] = movie.episodes_list && movie.episodes_list.length
  // ? movie.episodes_list
  // : movie.meta?.ophim_episode_list?.[0]
  //     ? (() => {
  //         try {
  //           const phpData = unserialize(movie.meta.ophim_episode_list[0]) as any;
  //           const epArray: Episode[] = [];
  //           Object.values(phpData).forEach((server: any) => {
  //             Object.values(server.server_data || {}).forEach((ep: any) => {
  //               epArray.push({
  //                 number: parseInt(ep.name),
  //                 title: ep.filename,
  //                 link_m3u8: ep.link_m3u8,
  //                 link_embed: ep.link_embed,
  //                 duration: movie.meta?.ophim_runtime?.[0] || "",
  //                 isWatched: false,
  //               });
  //             });
  //           });
  //           return epArray;
  //         } catch (e) {
  //           console.error("Parse episodes_list failed", e);
  //           return [];
  //         }
  //       })()
  //     : [];

  type Episode = {
    number: number;
    title: string;
    link_m3u8: string;
    link_embed: string;
    duration: string;
    isWatched: boolean;
  };
  
  type EpisodeServer = {
    server_name: string;
    episodes: Episode[];
  };
  
  const episodes_list: EpisodeServer[] = movie.episodes_list && movie.episodes_list.length
    ? movie.episodes_list
    : movie.meta?.ophim_episode_list?.[0]
      ? (() => {
          try {
            const phpData = unserialize(movie.meta.ophim_episode_list[0]) as any;
            const servers: EpisodeServer[] = [];
  
            Object.values(phpData).forEach((server: any) => {
              const serverEpisodes: Episode[] = [];
  
              Object.values(server.server_data || {}).forEach((ep: any) => {
                serverEpisodes.push({
                  number: parseInt(ep.name),
                  title: ep.filename,
                  link_m3u8: ep.link_m3u8,
                  link_embed: ep.link_embed,
                  duration: movie.meta?.ophim_runtime?.[0] || "",
                  isWatched: false,
                });
              });
  
              servers.push({
                server_name: server.server_name,
                episodes: serverEpisodes,
              });
            });
  
            return servers;
          } catch (e) {
            console.error("Parse episodes_list failed", e);
            return [];
          }
        })()
      : [];
  
  const tabs = ["Tập phim", "Đề xuất"];

  return (
    <div className="min-h-screen bg-[#191a24] text-white ">
      
      {/* Background */}
      <div className="relative h-[100vh]">
        <div
          className="absolute inset-0 bg-cover bg-center background-fade"
          style={{
            backgroundImage: `url('${backdrop}')`,
          }}
          />

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(0deg, rgba(25, 27, 36, 1), rgba(25, 27, 36, 0))`,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full mx-auto  -mt-10">
      <div className=" mx-auto px-8 pb-8 -mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
          {/* Left Column */}
          <div
            className="lg:col-span-1 rounded-[1.25rem_1.25rem_1.25rem_3rem p-8 mb-6 "
            style={{
              borderRadius: "1.25rem 3rem 1.25rem 1.25rem",
              backgroundColor: "rgba(25,27,36,0.7)",

              // backdropFilter: "blur(20px)",
              // WebkitBackdropFilter: "blur(20px)",
            }}
          >
            
            <Image
              src={thumb}
              alt={movie.title}
              width={200}
              height={300}
              className="w-[40%] h-auto object-cover rounded-xl mb-2"
              priority
            />
            <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
            <h3 className="text-base text-yellow-200 font-bold mb-2">{originTitle}</h3>
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4 mt-2">
               {movie.meta?.ophim_quality && (
                  <Badge variant="white">{movie.meta.ophim_quality}</Badge>
               )}
               {movie.meta?.ophim_lang && (
                  <Badge variant="outline">{movie.meta.ophim_lang}</Badge>
               )}
               {movie.meta?.ophim_episode && (
                  <Badge variant="outline">{movie.meta.ophim_episode}</Badge>
               )}
               {year && <Badge variant="outline">{year}</Badge>}

               {tags.map((tag: string, idx: number) => (
                  <Badge key={idx} variant="outline">
                     {tag}
                  </Badge>
               ))}
               </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-4">
               {genres.map((genre: string, index: number) => (
                  <Badge key={index} variant="transparent">
                     {GENRES_MAP[genre] || genre}
                   </Badge>
               ))}
               </div>

               {movie.meta?.ophim_total_episode?.[0] &&
                movie.meta?.ophim_total_episode?.[0] !== "1" && (() => {
                  const currentEp = movie.meta?.ophim_episode?.[0];
                  const totalEp = movie.meta?.ophim_total_episode?.[0];
                  const isCompleted = currentEp?.toLowerCase().includes("hoàn tất");

                  return (
                    <div
                      className={`mb-2 inline-flex items-center gap-2 px-5 py-3 rounded-full ${
                        isCompleted
                          ? "bg-green-900/20 text-green-400"
                          : "bg-orange-900/20 text-orange-400"
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs font-medium">{movie.meta?.ophim_episode?.[0]}</span>
                        </>
                      ) : (
                        <>
                          <LoaderCircle className="w-4 h-4 animate-spin" />
                          <span className="text-xs">
                            Đã chiếu: {currentEp?.replace("Tập ", "")} / {totalEp}
                          </span>
                        </>
                      )}
                    </div>
                  );
                })()}


            {/* Description */}
            <h5 className="font-bold">Giới thiệu:</h5>
            <p className="text-gray-300 text-sm leading-relaxed mt-2">{cleanText(description)}</p>
            <div className="space-y-1 text-sm text-gray-300 mt-2">
              {movie.meta?.ophim_runtime?.[0] && (
                <p className="mt-4">
                  <span className="font-semibold text-white">Thời lượng:</span>{" "}
                  {movie.meta.ophim_runtime[0]}
                </p>
              )}
                <p className="mt-4">
                  <span className="font-semibold text-white">Quốc gia:</span> {country}
                </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-3">
          <div
            className="flex flex-col flex-grow rounded-[3rem_1.25rem_1.25rem_1.25rem] p-6 mb-6"
            style={{
              backgroundColor: "rgba(25,27,36,0.9)",
              
            }}
          >
              {/* Actions */}
              <div className="flex items-center gap-12 mb-20">
                <button className="flex items-center gap-3 bg-gradient-to-tr from-[rgb(254,207,89)] to-[rgb(255,241,204)] 
                                text-black transition duration-300 transform 
                                hover:scale-110 hover:shadow-[0_0_40px_rgb(255,241,204)] px-8 py-4 rounded-full font-bold text-md transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <Play className="w-6 h-6 fill-current" /> Xem Ngay
                </button>
                <button onClick={() => setIsLiked(!isLiked)} className="flex flex-col items-center gap-2 text-gray-300 hover:text-white transition-colors">
                  <Heart className={`w-5 h-5 ${isLiked ? "fill-yellow-200 text-yellow-200" : ""}`} />
                  <span className="text-sm">Yêu thích</span>
                </button>
                <button className="flex flex-col items-center gap-2 text-gray-300 hover:text-white transition-colors">
                  <Plus className="w-5 h-5" />
                  <span className="text-sm">Thêm vào</span>
                </button>
                <button className="flex flex-col items-center gap-2 text-gray-300 hover:text-white transition-colors">
                  <Share className="w-5 h-5" />
                  <span className="text-sm">Chia sẻ</span>
                </button>
                <button className="flex flex-col items-center gap-2 text-gray-300 hover:text-white transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm">Bình luận</span>
                </button>

                {rating && (
                  <div className="flex items-center gap-2 bg-blue-600 px-4 py-3 rounded-full">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-lg">{rating}</span>
                    <span className="text-sm">Đánh giá</span>
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div className="flex gap-8 mb-8 border-b rounded-lg border-gray-800">
                {tabs.map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 px-2 font-medium transition-all duration-300 ${activeTab === tab ? "text-yellow-200 border-b-2 border-yellow-200" : "text-gray-400 hover:text-white"}`}>{tab}</button>
                ))}
              </div>

              {/* Episodes */}
              {movie.meta?.ophim_total_episode?.[0] === "1" ? (
                //  Giao diện phim lẻ
                <div className="w-full flex">
              
                    <div className="w-1/3">
                      <div className="relative flex items-center gap-3 bg-gray-700/70 rounded-xl p-10 overflow-hidden">
                        <div className="absolute top-2 left-2 flex items-center gap-1 text-xs text-white/80 p-8">
                          <Server className="w-4 h-4" />
                          <span className="font-bold">{movie.meta.ophim_lang}</span>
                        </div>

                        <div className="flex-1 min-w-[100px] relative z-10 pt-12">
                          <h3 className="text-sm font-semibold mb-2">{movie.title}</h3>
                          <button
                            onClick={() => {
                              setSelectedEpisode(1);
                              router.push(`/movie/${slug}/tap-1-server-0`); // phim lẻ mặc định server 0
                            }}
                            className="px-3 py-1 rounded-md bg-white text-black text-xs font-medium hover:bg-gray-200 transition"
                          >
                            Xem bản này
                          </button>
                        </div>
                        <div className="absolute top-0 right-0 h-full w-32">
                          <img
                            src={thumb}
                            alt={movie.name}
                            className="w-full h-full object-cover rounded-r-xl"
                            style={{
                              WebkitMaskImage: "linear-gradient(270deg, black 0px, transparent 95%)",
                              WebkitMaskRepeat: "no-repeat",
                              WebkitMaskSize: "100% 100%",
                              maskImage: "linear-gradient(270deg, black 0px, transparent 95%)",
                              maskRepeat: "no-repeat",
                              maskSize: "100% 100%",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                  </div>
              ) : (
                //  Giao diện phim bộ (list tập)
                episodes_list.map((server, idx) => (
                  <div key={idx} className="mb-6">
                   
                    <Badge
                      variant="outline"
                      className="h-9 flex items-center"
                      icon={<Server className="w-4 h-4" />}
                    >
                      {server.server_name}
                    </Badge>

                    <div className="grid grid-cols-2 md:grid-cols-8 gap-2 mt-4">
                      {server.episodes.map((ep) => (
                        <button
                          key={ep.number}
                          onClick={() => {
                            setSelectedEpisode(ep.number);
                            router.push(`/movie/${slug}/tap-${ep.number}-server-${idx}`); 
                          }}
                          className={`flex items-center justify-center gap-2 px-4 py-4 rounded-md bg-gray-800 hover:text-yellow-200 transition-all duration-300 ${
                            selectedEpisode === ep.number
                              ? "bg-[#ffd875]"
                              : "text-gray-200"
                          }`}
                        >
                          <Play className="w-4 h-4" />
                          <span className="font-bold text-sm">Tập {ep.number}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}

              {activeTab !== "Tập phim" && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🚧</div>
                  <h3 className="text-2xl font-bold mb-2">Nội dung {activeTab}</h3>
                  <p className="text-gray-400">Nội dung cho tab này sẽ được cập nhật sớm</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default MovieDetail;
