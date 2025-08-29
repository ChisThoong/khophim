import { NextResponse } from "next/server";
const API_HOST = process.env.NEXT_PUBLIC_HOST_API;
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get("region") || "trung-quoc";
    const perPage = searchParams.get("per_page") || "10";

    const res = await fetch(
      `${API_HOST}/region/${region}?per_page=${perPage}`,
      { cache: "no-store" }
    );

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
