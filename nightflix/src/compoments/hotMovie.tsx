import React, { useEffect, useState } from 'react';
import '../index.css'
import '../App.css'
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
interface Movie {
  id: number;
  title: string;
  genre: string;
  poster: string;
  _id: string;
  posterUrl: string;
  rate: number;
  plot: string;

}

const HotMovies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchHotMovies = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/Hot');

        // Kiểm tra nếu phản hồi không thành công (status khác 200)
        if (!response.ok) {
          console.error('Failed to fetch data. Status:', response.status);
          return;
        }

        // Bắt lỗi khi chuyển đổi dữ liệu thành JSON
        const data = await response.json();
        console.log(data);

        setMovies((data as any).movies);
      } catch (error) {
        console.error('Error fetching Hot movies:', error);
      }
    };

    fetchHotMovies();
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen p-5 text-white">
      <Navigation />
      <h1 className="text-3xl font-bold text-center mb-8">Hot Movies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.slice(0, 20).map((movie) => (
          <div
            key={movie._id}
            className="bg-gray-800 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-60 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-200 truncate">{movie.title}</h2>

              <p className="text-sm text-gray-400 mt-2"> {movie.plot}</p>
              <Link to={`/movie/${movie._id}`}> {/* Updated to use Link */}
                <button className="bg-green-500 px-6 py-2 mt-4 rounded-lg">View Now</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



export default HotMovies;

