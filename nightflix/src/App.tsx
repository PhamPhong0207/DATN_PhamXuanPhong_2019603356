/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link, BrowserRouter as Router } from 'react-router-dom';
import './App.css'
import SearchBar from './compoments/SearchBar';
import './i18n';
import { useState } from 'react';
import { useEffect } from 'react';

interface Movie {
  _id: string;
  title: string;
  poster: string;
  plot: string;
  imdb: {
    rating: number;
    votes: number;
  };
}

interface CurrentUser {
  email: string;
  username: string;
  role: string;
}

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      const parsedUser = JSON.parse(user);
      console.log("Parsed user:", parsedUser); // Debug log
      setCurrentUser(parsedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    console.log("currentUser.username");
    setCurrentUser(null);
  };
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
    <div className="bg-gray-900 min-h-screen text-white font-sans">

      <header className="flex justify-between items-center p-4">
        <div className="flex space-x-4 mb-8">
        </div>
        <div className="absolute top-0 left 3 text-3xl font-bold text-red-500 p-4">
          NightFlix
        </div>

        <nav className="flex space-x-4 font-bold ">
          <Link to="/Action" className=" hover:text-green-400 ">Action</Link>
          <Link to="/Drama" className="hover:text-green-400">Drama</Link>
          <Link to="/Comedy" className="hover:text-green-400">Comedy</Link>
          <Link to="/Horror" className="hover:text-green-400">Horror</Link>
          <Link to="/Hot" className="hover:text-green-400">Hot</Link>
        </nav>
        <div className="flex space-x-4 items-center">
          <div><SearchBar /> </div>
          <div>
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <p className="text-green-400">
                  Hello, <strong className="text-white">{currentUser.username}</strong>
                </p>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-full transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/Login" className="bg-green-500 hover:bg-green-600 px-4 py-1 rounded-full transition-colors">Login</Link>
                <Link to="/Register" className="bg-yellow-500 hover:bg-yellow-600 px-4 py-1 rounded-full transition-colors">Regis</Link>
              </div>
            )}
          </div>
        </div>

      </header>
      <main className="p-4">
        <section className="flex flex-col md:flex-row md:space-x-6">
          {/* Featured Movie */}
          <div className="md:w-3/5 lg:w-1/2 bg-gray-800 p-4 rounded-lg">
            {movies.slice(1, 2).map((movie) => (
              <div key={movie._id} className="bg-gray-800 p-2 rounded-lg">
                <img src={movie.poster} alt={movie.title} className="w-full rounded-lg" />
                <div className="mt-2">
                  <h4 className="text-sm font-semibold">{movie.title}</h4>
                  <p className="text-xs text-green-400">Votes: {movie.imdb.votes}★</p>
                  <p className="text-sm text-gray-400 mt-2"> {movie.plot}</p>
                </div>
                <Link to={`/movie/${movie._id}`}> {/* Updated to use Link */}
                  <button className="bg-green-500 px-6 py-2 mt-4 rounded-lg">View Now</button>
                </Link>
              </div>
            ))}
          </div>


          {/* Popular Movies */}
          <div className="md:w-2/5 lg:w-1/2 mt-6 md:mt-0">
            <h3 className="text-4xl font-bold mb-6 text-orange-400">Hot on NightFlix</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...movies.slice(0, 1), ...movies.slice(2, 7)].map((movie) => (
                <div key={movie._id} className="bg-gray-800 p-2 rounded-lg">
                  <img src={movie.poster} alt={movie.title} className="w-full rounded-lg" />
                  <div className="mt-2">
                    <h4 className="text-sm font-semibold">{movie.title}</h4>
                    <p className="text-xs text-green-400">Votes: {movie.imdb.votes}★</p>
                    <p className="text-sm text-gray-400 mt-2"> {movie.plot}</p>
                  </div>
                  <Link to={`/movie/${movie._id}`}> {/* Updated to use Link */}
                    <button className="bg-green-500 px-6 py-2 mt-4 rounded-lg">View Now</button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>

  );
};

