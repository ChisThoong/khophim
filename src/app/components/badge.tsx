import React from "react";
import clsx from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "default"
    | "yellow"
    | "white"
    | "outline"
    | "transparent"
    | "softYellow"
    | "green";
}

export default function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={clsx(
        "text-xs font-semibold rounded px-2.5 py-1",
        variant === "yellow" &&
          "bg-[linear-gradient(39deg,rgb(254,207,89),rgb(255,241,204))] text-black",
        variant === "white" && "bg-white text-black",
        variant === "outline" && "border border-white/60 text-white",
        variant === "default" && "bg-gray-700 text-white",
        variant === "transparent" && "bg-white/20 text-white",
        variant === "softYellow" &&
          "text-[#FFDE8A] border border-[rgb(254,207,89)]",
        variant === "green" && "bg-green-600 text-white"
      )}
    >
      {children}
    </span>
  );
}

