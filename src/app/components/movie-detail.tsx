"use client"
import { useState } from 'react';
import { Play, Heart, Plus, Share, MessageCircle, Star, Trophy, Gift, Flame, Menu, Monitor } from 'lucide-react';
interface Episode {
number: number;
title: string;
duration: string;
isWatched: boolean;
}
interface Movie {
title: string;
englishTitle?: string;
poster?: string;
backdrop?: string;
rating?: number;
imdbRating?: number;
year?: number;
episodes?: string;
tags?: string[];
genres?: string[];
description?: string;
episodes_list?: Episode[];
}
interface MovieDetailProps {
movie?: Movie;
}
const MovieDetail = ({ movie }: MovieDetailProps) => {
const [activeTab, setActiveTab] = useState('Tập phim');
const [selectedEpisode, setSelectedEpisode] = useState(1);
const [isLiked, setIsLiked] = useState(false);
// Mock data - replace with props or API data
const movieData = {
    title: movie?.title || "Tủ Quần Áo Lọ Lem",
    englishTitle: movie?.englishTitle || "Cinderella Closet",
    poster: movie?.poster || "/api/placeholder/200/300",
    backdrop: movie?.backdrop || "/api/placeholder/1200/600",
    rating: movie?.rating || 8.0,
    imdbRating: movie?.imdbRating || 8.2,
    year: movie?.year || 2025,
    episodes: movie?.episodes || "8/10 tập",
    tags: movie?.tags || ["T16", "Phần 1", "Tập 8"],
    genres: movie?.genres || ["Chính Kịch", "Live Action", "Tình Cảm", "Lãng Mạn", "Chuyển Thể"],
    description: movie?.description || "Một câu chuyện tình lãng mạn hiện đại về một cô gái trẻ tìm thấy tình yêu thông qua thời trang và sự tự tin.",
    episodes_list: movie?.episodes_list || Array.from({length: 8}, (_, i) => ({
    number: i + 1,
    title: `Tập ${i + 1}`,
    duration: "45 phút",
    isWatched: i < 3
    }))
    };
const tabs = ['Tập phim', 'Gallery', 'Diễn viên', 'Đề xuất'];
return (
<div className="min-h-screen bg-gray-900 text-white">
   {/* Large Background Poster */}
   <div className="relative">
      <div 
      className="h-[60vh] bg-cover bg-center bg-no-repeat relative"
      style={{
      backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%), url('https://static.nutscdn.com/vimg/1920-0/91475658a5c8fddb79ae478e17ab2e71.webp')`
      }}
      >
   </div>
</div>
{/* Promotional Banner */}
{/* 
<div className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 py-3">
   <div className="max-w-7xl mx-auto px-8">
      <div className="flex items-center justify-center gap-4 text-white font-bold">
         <span className="text-2xl">TX88</span>
         <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            <span className="text-xl">THƯỞNG NẠP 8888K</span>
            <Gift className="w-5 h-5" />
            <span className="text-xl">+ 20TR</span>
         </div>
         <span className="bg-red-600 px-3 py-1 rounded-lg text-sm animate-pulse">CỰC NGAY</span>
      </div>
   </div>
</div>
*/}
{/* Main Content - Split into 2 columns */}
<div className="w-full mx-auto px-8 py-8">
   <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Movie Card & Info (1/3 width) */}
      <div className="lg:col-span-1">
         {/* Movie Card */}
         <div className="">
            <div className="w-full  overflow-hidden mb-4">
               <img 
                  src="https://static.nutscdn.com/vimg/300-0/538d6d80c97c6f08b68d1a4904cc2854.jpg"
                  alt={movieData.title}
                  className="w-[40%] h-auto object-cover rounded-xl"
                  />
            </div>
            <h2 className="text-2xl font-bold mb-2">{movieData.title}</h2>
            <p className="text-lg text-orange-400 mb-4">{movieData.englishTitle}</p>
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
               <div className="bg-yellow-600 px-3 py-1 rounded-lg text-xs font-bold">
                  IMDb {movieData.imdbRating}
               </div>
               <div className="bg-red-600 px-3 py-1 rounded-lg text-xs font-bold">
                  T16
               </div>
               <div className="bg-gray-700 px-3 py-1 rounded-lg text-xs">
                  {movieData.year}
               </div>
               <div className="bg-purple-600 px-3 py-1 rounded-lg text-xs">
                  Phần 1
               </div>
               <div className="bg-orange-600 px-3 py-1 rounded-lg text-xs">
                  Tập 8
               </div>
            </div>
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-4">
               {movieData.genres.map((genre, index) => (
               <span key={index} className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-xs cursor-pointer transition-colors">
               {genre}
               </span>
               ))}
            </div>
            {/* Episode Progress */}
            <div className="mb-4">
               <div className="flex items-center gap-2 text-orange-400">
                  <Flame className="w-4 h-4" />
                  <span className="font-semibold text-sm">Đã chiếu: {movieData.episodes}</span>
               </div>
            </div>
            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed">
               {movieData.description}
            </p>
         </div>
      </div>
      {/* Right Column - Episodes & Tabs (2/3 width) */}
      <div className="lg:col-span-2 ">
         <div className = "bg-gray-800 rounded-2xl p-6 mb-6">
            <div className="w-full ml-auto  mb-6">
               <div className="flex items-center gap-12 mb-20">
                  <button className="flex items-center gap-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                     <Play className="w-6 h-6 fill-current" />
                     Xem Ngay
                  </button>
                  <button 
                     onClick={() => setIsLiked(!isLiked)}
                  className="flex flex-col items-center gap-2 text-gray-300 hover:text-white transition-colors"
                  >
                  <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  <span className="text-sm">Yêu thích</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 text-gray-300 hover:text-white transition-colors">
                     <Plus className="w-6 h-6" />
                     <span className="text-sm">Thêm vào</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 text-gray-300 hover:text-white transition-colors">
                     <Share className="w-6 h-6" />
                     <span className="text-sm">Chia sẻ</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 text-gray-300 hover:text-white transition-colors">
                     <MessageCircle className="w-6 h-6" />
                     <span className="text-sm">Bình luận</span>
                  </button>
                  {/* Rating - Top Right Corner */}
                  <div className="flex items-center gap-2 bg-blue-600 px-4 py-3 rounded-full">
                     <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                     <span className="font-bold text-lg">{movieData.rating}</span>
                     <span className="text-sm">Đánh giá</span>
                  </div>
               </div>
            </div>
            {/* Tabs */}
            <div className="flex gap-8 mb-8 border-b rounded-lg border-gray-800">
               {tabs.map((tab) => (
               <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
               className={`pb-4 px-2 font-medium transition-all duration-300 ${
               activeTab === tab 
               ? 'text-orange-500 border-b-2 border-orange-500' 
               : 'text-gray-400 hover:text-white'
               }`}
               >
               {tab}
               </button>
               ))}
            </div>
            {/* Episodes Section */}
            {activeTab === 'Tập phim' && (
            <div>
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                     <h3 className="text-xl font-bold flex items-center gap-3">
                        ☰ Phần 1
                     </h3>
                     <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2">
                     📺 Phụ đề
                     </button>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="text-gray-400 text-sm">Rút gọn</span>
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-orange-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                     </label>
                  </div>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {movieData.episodes_list.map((episode) => (
                  <button
                     key={episode.number}
                     onClick={() =>
                     setSelectedEpisode(episode.number)}
                     className={`relative group bg-gray-800 hover:bg-gray-700 rounded-xl p-4 text-center transition-all duration-300 transform hover:scale-105 ${
                     selectedEpisode === episode.number ? 'ring-2 ring-orange-500 bg-orange-900' : ''
                     }`}
                     >
                     <Play className="w-6 h-6 mx-auto mb-2 text-orange-500 group-hover:text-orange-400" />
                     <div className="font-semibold text-sm">{episode.title}</div>
                     {episode.isWatched && (
                     <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full"></div>
                     )}
                  </button>
                  ))}
               </div>
            </div>
            )}
            {/* Other tabs placeholder */}
            {activeTab !== 'Tập phim' && (
            <div className="text-center py-16">
               <div className="text-6xl mb-4">🚧</div>
               <h3 className="text-2xl font-bold mb-2">Nội dung {activeTab}</h3>
               <p className="text-gray-400">Nội dung cho tab này sẽ được cập nhật sớm</p>
            </div>
            )}
         </div>
      </div>
   </div>
</div>
</div>
);
};
export default MovieDetail;