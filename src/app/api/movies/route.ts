import { NextResponse } from "next/server";
const API_HOST = process.env.NEXT_PUBLIC_HOST_API;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const filters: Record<string, string> = {
        categories: searchParams.get("categories") || "",
        genres: searchParams.get("genres") || "",
        years: searchParams.get("years") || "",
        regions: searchParams.get("regions") || "",
      };
    const perPage = searchParams.get("per_page") || "10";
    const page = searchParams.get("page") || "1";

    const url = new URL("https://phimchill.site/wp-json/ophim/v1/movies");

    Object.entries(filters).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });

    url.searchParams.set("per_page", perPage);
    url.searchParams.set("page", page);

    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Không lấy được dữ liệu" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
