import MovieDetail from "@/app/components/detail/movie-detail";

export default async function MoviePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params; 
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/movie-detail?slug=${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Không lấy được dữ liệu phim");
  }

  const movie = await res.json();

  return <MovieDetail movie={movie} />;
}
