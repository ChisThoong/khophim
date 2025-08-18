import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://phimchill.site/wp-json/ophim/v1/hot", {
      next: { revalidate: 60 }, // cache 60s
    });

    if (!res.ok) {
      throw new Error(`WP API error: ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error("API get-hot-movies-slider error:", err.message);
    return NextResponse.json(
      { error: "Failed to fetch hot movies" },
      { status: 500 }
    );
  }
}
