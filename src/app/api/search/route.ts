import { NextResponse } from "next/server";
const API_HOST = process.env.NEXT_PUBLIC_HOST_API;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag") || "";
    const perPage = searchParams.get("per_page") || "10";

    if (!tag) {
      return NextResponse.json({ error: "Thiếu tag" }, { status: 400 });
    }

    const url = new URL("https://phimchill.site/wp-json/ophim/v1/search");
    url.searchParams.set("tag", tag);
    url.searchParams.set("per_page", perPage);

    const res = await fetch(url.toString(), { cache: "no-store" });

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
