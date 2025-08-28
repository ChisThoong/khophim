"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Player from "@/app/components/global/player";
import { Play, Heart, Plus, Share, MessageCircle, Star, Server, CheckCircle, LoaderCircle, ChevronLeft } from "lucide-react";
import { unserialize } from 'php-serialize';
import { GENRES_MAP } from "@/constants/genres";
import Badge from "@/app/components/global/badge";
import { cleanText } from "@/lib/cleanText";
import { CountryMap } from "@/constants/countries";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Episode {
  number: number;
  title: string;
  duration?: string;
  isWatched?: boolean;
  link_m3u8?: string;
  link_embed?: string;
}

interface EpisodeServer {
  server_name: string;
  episodes: Episode[];
}

export default function EpisodePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const tapServer = params?.["tap-server"] as string;

  const [episodeData, setEpisodeData] = useState<any>(null);
  const [movieData, setMovieData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Tập phim");
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [isLiked, setIsLiked] = useState(false);

  // --- Xử lý giá trị tapServer ---
  let tap: string | number = "full";
  let server: number | null = null;
  let validationError: string | null = null;

  if (!tapServer) {
    validationError = "Không tìm thấy tập phim";
  } else {
    const parts = tapServer.split("-");
    if (parts.length !== 4 || parts[2] !== "server") {
      validationError = "Định dạng URL không hợp lệ";
    } else {
      tap = parts[1];
      server = parseInt(parts[3], 10);

      if (tap !== "full") {
        const parsed = parseInt(tap, 10);
        if (isNaN(parsed)) {
          validationError = "Thông tin tập phim không hợp lệ";
        } else {
          tap = parsed;
        }
      }
    }
  }

  // --- useEffect luôn được gọi ---
  useEffect(() => {
    if (validationError || server === null) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch episode data
        const episodeRes = await fetch(
          `/api/episode?slug=${slug}&server=${server}&episode=${tap}`,
          { cache: "no-store" }
        );

        if (!episodeRes.ok) {
          const err = await episodeRes.json();
          throw new Error(err.error || "Không lấy được dữ liệu");
        }

        const episodeData = await episodeRes.json();
        setEpisodeData(episodeData);

        // Set selected episode
        if (typeof tap === 'number') {
          setSelectedEpisode(tap);
        }

        // Fetch movie data
        try {
          const movieRes = await fetch(`/api/movie-detail?slug=${slug}`, { cache: "no-store" });
          if (movieRes.ok) {
            const movieData = await movieRes.json();
            setMovieData(movieData);
          }
        } catch (movieErr) {
          console.error("Failed to fetch movie data:", movieErr);
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, tap, server, validationError]);

  if (validationError) return <div className="min-h-screen bg-[#191a24] text-white flex items-center justify-center">{validationError}</div>;
  if (loading) return <div className="min-h-screen bg-[#191a24] text-white flex items-center justify-center">Đang tải...</div>;
  if (error) return <div className="min-h-screen bg-[#191a24] text-white flex items-center justify-center">Lỗi: {error}</div>;
  if (!episodeData) return <div className="min-h-screen bg-[#191a24] text-white flex items-center justify-center">Không có dữ liệu</div>;

  // Process movie data
  const movie = movieData || {};
  const poster = movie.poster || movie.meta?.ophim_poster_url?.[0] || "/api/placeholder/200/300";
  const thumb = movie.poster || movie.meta?.ophim_thumb_url?.[0] || "/api/placeholder/200/300";
  const backdrop = movie.backdrop || movie.meta?.ophim_backdrop_url?.[0] || poster;
  const year = movie.year || movie.meta?.ophim_year?.[0] || "";
  const rating = movie.rating || movie.meta?.ophim_rating?.[0] || null;
  const tags = movie.tags?.length ? movie.tags : movie.meta?.tags?.[0]?.split(",") || [];
  const description = movie.content || "";
  const originTitle = movie.meta?.ophim_original_title?.[0] || "";
  
  const genres: string[] = movie.class_list
    ?.filter((c: string) => c.startsWith("ophim_genres-"))
    .map((c: string) => c.replace("ophim_genres-", "")) || [];

  const countrySlug = movie.class_list?.find((c: string) => c.startsWith("ophim_regions-"))
    ?.replace("ophim_regions-", "") || "";
  const country = CountryMap[countrySlug] || "";

  // Parse episodes list
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

  const handleEpisodeClick = (episodeNumber: number, serverIndex: number) => {
    setSelectedEpisode(episodeNumber);
    router.push(`/movie/${slug}/tap-${episodeNumber}-server-${serverIndex}`);
  };

  return (
    <div className="min-h-screen bg-[#191a24] text-white">
    
      {/* Main Content */}
        <div className="mx-auto px-8 pb-8 w-full pt-30 bg-[#191a24]">
        <div className="flex items-center gap-2 mb-8">
          <Link
            href="/"
            className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-600 hover:bg-gray-700 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <span className="font-bold text-xl">
          Xem phim {cleanText(movie?.title || episodeData?.title)} 
          </span>
        </div>
          {/* Video Player Section */}
          <div className="mb-8">
            <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl">
              <Player src={episodeData.link_m3u8} />
            </div>
            
          </div>

          {/* Movie Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: 2/3 content */}
            <div className="lg:col-span-2 border-r border-gray-700 flex flex-col justify-between">
            <div
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 rounded-[1.25rem_3rem_1.25rem_1.25rem] p-6"
                style={{
                  backgroundColor: "rgba(25,27,36,0.7)",
                }}
              >
                {/* Col 1: Poster + Info */}
                <div className="flex gap-6">
                  {/* Poster */}
                  <div className="flex-shrink-0">
                    <Image
                      src={thumb}
                      alt={movie.title || "Movie"}
                      width={200}
                      height={300}
                      className="w-[120px] h-auto object-cover rounded-xl"
                      priority
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <h2 className="text-xl font-bold mb-2">
                        {cleanText(movie.title || episodeData.title)}
                      </h2>
                      {originTitle && (
                        <h3 className="text-base text-yellow-200 font-bold mb-4">
                          {originTitle}
                        </h3>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {movie.meta?.ophim_quality && (
                          <Badge variant="white">{movie.meta.ophim_quality}</Badge>
                        )}
                        {year && <Badge variant="outline">{year}</Badge>}
                        {tags.map((tag: string, idx: number) => (
                          <Badge key={idx} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Genres */}
                      {genres.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {genres.map((genre: string, index: number) => (
                            <Badge key={index} variant="transparent">
                              {GENRES_MAP[genre] || genre}
                            </Badge>
                          ))}
                        </div>
                      )}

                      
                    </div>
                  </div>
                </div>

                {/* Col 2: Description */}
                <div>
                  {description && (
                    <>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {cleanText(description)}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: 1/3 sidebar */}
            <div className="lg:col-span-1">
              {/* Ở đây bạn có thể thêm sidebar: related movies, cast, ads... */}
            </div>
          </div>




          <div className="lg:col-span-1">
              <div
                className="flex flex-col rounded-[3rem_1.25rem_1.25rem_1.25rem] p-6"
                style={{
                  backgroundColor: "rgba(25,27,36,0.9)",
                }}
              >               
                {/* Tabs */}
                <div className="flex gap-8 mb-8 border-b border-gray-800">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-4 px-2 font-medium transition-all duration-300 ${
                        activeTab === tab
                          ? "text-yellow-200 border-b-2 border-yellow-200"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Episodes List */}
                {activeTab === "Tập phim" && (
                  <div>
                    {movie.meta?.ophim_total_episode?.[0] === "1" ? (
                      // Single movie
                      <div className="w-full flex">
                        <div className="w-1/3">
                          <div className="relative flex items-center gap-3 bg-gray-700/70 rounded-xl p-6 overflow-hidden">
                            <div className="absolute top-2 left-2 flex items-center gap-1 text-xs text-white/80">
                              <Server className="w-4 h-4" />
                              <span className="font-bold">{movie.meta?.ophim_lang?.[0] || episodeData.server_name}</span>
                            </div>

                            <div className="flex-1 min-w-[100px] relative z-10 pt-8">
                              <h3 className="text-sm font-semibold mb-2">{cleanText(movie.title || episodeData.title)}</h3>
                              <div className="px-3 py-1 rounded-md bg-yellow-200 text-black text-xs font-medium inline-block">
                                Đang xem
                              </div>
                            </div>
                            <div className="absolute top-0 right-0 h-full w-24">
                              <Image
                                src={thumb}
                                alt={movie.title || "Movie"}
                                width={96}
                                height={144}
                                className="w-full h-full object-cover rounded-r-xl"
                                style={{
                                  WebkitMaskImage: "linear-gradient(270deg, black 0px, transparent 95%)",
                                  maskImage: "linear-gradient(270deg, black 0px, transparent 95%)",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Series with episodes
                      episodes_list.length > 0 ? (
                        episodes_list.map((serverData, idx) => (
                          <div key={idx} className="mb-6">
                            <Badge
                              variant="outline"
                              className="h-9 flex items-center mb-4"
                              icon={<Server className="w-4 h-4" />}
                            >
                              {serverData.server_name}
                            </Badge>

                            <div className="grid grid-cols-2 md:grid-cols-8 gap-2">
                              {serverData.episodes.map((ep) => (
                                <button
                                  key={ep.number}
                                  onClick={() => handleEpisodeClick(ep.number, idx)}
                                  className={`flex items-center justify-center gap-2 px-4 py-4 rounded-md transition-all duration-300 ${
                                    selectedEpisode === ep.number && idx === server
                                      ? "bg-[#ffd875] text-black"
                                      : "bg-gray-800 text-gray-200 hover:text-yellow-200"
                                  }`}
                                >
                                  <Play className="w-4 h-4" />
                                  <span className="font-bold text-sm">Tập {ep.number}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          Không tìm thấy danh sách tập phim
                        </div>
                      )
                    )}
                  </div>
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
    
  );
}