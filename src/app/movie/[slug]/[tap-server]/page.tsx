"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Player from "@/app/components/global/player";
export default function EpisodePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const tapServer = params?.["tap-server"] as string;

  const [episodeData, setEpisodeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!tapServer) {
    return <div>Không tìm thấy tập phim</div>;
  }

  // Định dạng mong muốn: tap-1-server-0
  const parts = tapServer.split("-");

  if (parts.length !== 4 || parts[0] !== "tap" || parts[2] !== "server") {
    return <div>Định dạng URL không hợp lệ</div>;
  }

  const tap = parseInt(parts[1], 10);
  const server = parseInt(parts[3], 10);

  if (isNaN(tap) || isNaN(server)) {
    return <div>Thông tin tập phim không hợp lệ</div>;
  }

  // Gọi API để lấy link tập phim
  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/episode?slug=${slug}&server=${server}&episode=${tap}`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Không lấy được dữ liệu");
        }

        const data = await res.json();
        setEpisodeData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisode();
  }, [slug, tap, server]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;
  if (!episodeData) return <div>Không có dữ liệu</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">
        {episodeData.title} - Tập {episodeData.episode}
      </h1>
      <p className="text-gray-400 mb-4">
        Server: {episodeData.server_name}
      </p>

      {/* Player dùng iframe */}
      <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
        <Player src={episodeData.link_m3u8} />
      </div>
    </div>
  );
}
