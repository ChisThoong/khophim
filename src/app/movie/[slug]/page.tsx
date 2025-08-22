// movie/[slug]/page.tsx
import MovieDetail from "@/app/components/movie-detail";

interface PageProps {
  params: {
    slug: string;
  };
}

export default function MoviePage({ params }: PageProps) {
  // Bạn có thể sử dụng params.slug để fetch data từ API
  console.log('Movie slug:', params.slug);
  
  const movieData = {
    title: "Tủ Quần Áo Lọ Lem",
    englishTitle: "Cinderella Closet", 
    rating: 8.0,
    imdbRating: 8.2,
    year: 2025,
    episodes: "8/10 tập",
    genres: ["Chính Kịch", "Live Action", "Tình Cảm"],
    description: "Một câu chuyện tình lãng mạn hiện đại về một cô gái trẻ tìm thấy tình yêu thông qua thời trang và sự tự tin."
  };

  return <MovieDetail movie={movieData} />;
}