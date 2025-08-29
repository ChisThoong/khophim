import { NextResponse } from "next/server";
const API_HOST = process.env.NEXT_PUBLIC_HOST_API;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Thiếu slug" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `${API_HOST}/movie/${slug}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("WordPress error:", text);
      return NextResponse.json(
        { error: "Không lấy được dữ liệu từ WP" },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
