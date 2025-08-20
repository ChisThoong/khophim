import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get("region") || "trung-quoc";
    const perPage = searchParams.get("per_page") || "10";

    const res = await fetch(
      `https://phimchill.site/wp-json/wp/v2/ophim?ophim_regions=${region}&per_page=${perPage}&orderby=date&order=desc`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Không lấy được dữ liệu từ phimchill" },
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
