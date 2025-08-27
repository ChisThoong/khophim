"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";
import "plyr/dist/plyr.css";

interface PlayerProps {
  src: string; // link m3u8
}

export default function Player({ src }: PlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let hls: Hls | null = null;
    let player: any = null;

    async function initPlayer() {
      if (!videoRef.current) return;
      const video = videoRef.current;
      const Plyr = (await import("plyr")).default;

      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src; // Safari
      }

      player = new Plyr(video, {
        captions: { active: true, update: true, language: "auto" },
        quality: { default: 1080, options: [360, 480, 720, 1080] },
        speed: { selected: 1, options: [0.5, 1, 1.5, 2] },
        settings: ["quality", "captions", "speed"],
        controls: [
          "play-large",
          "rewind",
          "play",
          "fast-forward",
          "progress",
          "current-time",
          "duration",
          "mute",
          "volume",
          "captions",
          "settings", // cần cái này để menu hiện
          "fullscreen",
        ],
      });

      // Thêm menu item sau khi Plyr render xong
      setTimeout(() => {
        const pathname = window.location.pathname;
        const match = pathname.match(/tap-(\d+)-server-(\d+)/);

        if (match) {
          const currentEp = parseInt(match[1], 10);
          const serverIndex = match[2];
          const menu = player.elements.settings?.menu as HTMLElement | null;

          if (menu) {
            const ul = menu.querySelector("ul");
            if (ul) {
              // helper tạo button
              const addMenuItem = (label: string, url: string) => {
                const li = document.createElement("li");
                li.className = "plyr__menu__item";
                li.setAttribute("role", "menuitem");
                li.tabIndex = -1;

                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "plyr__control";
                btn.textContent = label;
                btn.onclick = () => {
                  window.location.href = url;
                };

                li.appendChild(btn);
                ul.appendChild(li);
              };

              // Thêm tập trước (nếu có)
              if (currentEp > 1) {
                const prevUrl = pathname.replace(
                  /tap-\d+-server-\d+/,
                  `tap-${currentEp - 1}-server-${serverIndex}`
                );
                addMenuItem(`Xem tập ${currentEp - 1}`, prevUrl);
              }

              // Thêm tập tiếp theo
              const nextUrl = pathname.replace(
                /tap-\d+-server-\d+/,
                `tap-${currentEp + 1}-server-${serverIndex}`
              );
              addMenuItem(`Xem tập ${currentEp + 1}`, nextUrl);
            }
          }
        }
      }, 300);
    }

    initPlayer();

    return () => {
      hls?.destroy();
      player?.destroy();
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      className="w-full aspect-video rounded-lg overflow-hidden"
      controls
      playsInline
    />
  );
}
