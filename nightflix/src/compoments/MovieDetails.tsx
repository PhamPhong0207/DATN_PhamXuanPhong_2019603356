import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Link, useParams } from "react-router-dom";
import { FaStar, FaTrash } from 'react-icons/fa';

interface Rating {
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Movie {
  _id: string;
  title: string;
  poster: string;
  plot: string;
  languages: string[];
  genres: string[];
  directors: string;
  releaseDate: string;
  year: number;
  countries: string[];
  cast: string[];
  fullplot: string;
  runtime: number;
  age: number;
  ratings?: Rating[];
}

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Sử dụng id từ URL
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showRatings, setShowRatings] = useState<boolean>(false);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const fetchMovieDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/movies/${id}`);
      if (!response.ok) {
        setError("Không thể tải thông tin phim.");
        setLoading(false);
        return;
      }
      const data = await response.json();
      setMovie(data);
      await fetchRatings();
    } catch (error) {
      setError("Đã xảy ra lỗi khi tải thông tin phim.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSimilarMovies = async () => {
      const response = await fetch(`http://localhost:3000/similar/${id}`);
      const data = await response.json();
      console.log(data);
      setSimilarMovies(data);
    };

    setLoading(true);
    setIsPlaying(false);
    fetchMovieDetails();
    fetchSimilarMovies();
  }, [id]);

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Vui lòng đăng nhập để đ��nh giá!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/movies/${id}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: currentUser.username,
          rating,
          comment,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || "There was an error submitting the rating!");
        return;
      }

      alert("Thank you for rating!");
      setRating(0);
      setComment("");

      // Fetch updated ratings
      const updatedMovie = await fetch(`http://localhost:3000/api/movies/${id}`).then(res => res.json());
      setMovie(updatedMovie);
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert("There was an error submitting the rating!");
    }
  };

  const fetchRatings = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/movies/${id}/ratings`);
      if (!response.ok) {
        throw new Error('Failed to fetch ratings');
      }
      const ratings = await response.json();
      setMovie(prevMovie => prevMovie ? { ...prevMovie, ratings } : null);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const handleDeleteRating = async (ratingIndex: number) => {
    if (currentUser?.role !== 'admin') return;
    
    try {
      const response = await fetch(`http://localhost:3000/api/movies/${id}/ratings/${ratingIndex}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete rating');
      }

      // Update local state
      const updatedMovie = await fetch(`http://localhost:3000/api/movies/${id}`).then(res => res.json());
      setMovie(updatedMovie);
      alert('Rating deleted successfully!');
    } catch (error) {
      console.error('Error deleting rating:', error);
      alert('There was an error deleting the rating!');
    }
  };

  const renderRatingSystem = () => (
    <div className="mt-8 bg-gray-800 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-green-300">Rating the movie</h2>
        <button
          onClick={() => setShowRatings(!showRatings)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          {showRatings ? 'Hide ratings' : 'View ratings'}
        </button>
      </div>

      {currentUser ? (
        <form onSubmit={handleRatingSubmit} className="space-y-4">
          <div className="flex items-center space-x-2">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <label key={index} className="cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    className="hidden"
                    value={ratingValue}
                    onClick={() => setRating(ratingValue)}
                  />
                  <FaStar
                    className="transition-colors"
                    color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                    size={24}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                  />
                </label>
              );
            })}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about the movie..."
            className="w-full p-2 rounded bg-gray-700 text-white"
            rows={4}
          />

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Send Rating
          </button>
        </form>
      ) : (
        <p className="text-yellow-400">Please <Link className="text-blue-500" to="/Login">Login</Link> to rate the movie!</p>
      )}

      {/* Display existing ratings - now with conditional rendering */}
      {showRatings && (
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-bold text-white">Rating from viewers</h3>
          {movie?.ratings && movie.ratings.length > 0 ? (
            movie.ratings.map((rating, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-green-400">{rating.username}</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          color={i < rating.rating ? "#ffc107" : "#e4e5e9"}
                          size={16}
                        />
                      ))}
                    </div>
                    {currentUser?.role === 'admin' && (
                      <button
                        onClick={() => handleDeleteRating(index)}
                        className="ml-2 p-1 text-sm bg-red-600 rounded hover:bg-red-700"
                        title="Delete rating"
                      >
                        <FaTrash size={14} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-300">{rating.comment}</p>
                <span className="text-sm text-gray-400">
                  {new Date(rating.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No ratings yet.</p>
          )}
        </div>
      )}
    </div>
  );

  if (loading) return <div className="text-center text-white">Loading...</div>;

  if (error)
    return <div className="text-center text-red-500">{error}</div>;

  if (!movie)
    return <div className="text-center text-white">Movie not found.</div>;

  return (
    <div>
      <div className=" flex space-x-4 bg-gray-900 min-h-screen p-5 text-white">
        <div className="relative w-[70%] max-w-4xl aspect-w-16 aspect-h-9">
          <ReactPlayer
            url="https://www.youtube.com/watch?v=eRsGyueVLvQ"
            playing={isPlaying} // Điều khiển video chạy dựa vào trạng thái
            controls
            width="100%"
            height="500px"
            onPlay={() => setIsPlaying(true)}
            className="rounded-lg"
          />
          {/* Poster */}
          {!isPlaying && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer rounded-lg"
              onClick={() => setIsPlaying(true)} // Bấm vào poster để chạy video
            >
              <img
                src={movie.poster}
                alt="Movie Poster"
                className="object-cover w-full h-full rounded-lg"
              />
              <button className="absolute bg-blue-500 text-white px-4 py-2 rounded-md">
                Play
              </button>
            </div>
          )}

        </div>
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <h1 className="text-4xl font-bold mb-6 text-orange-400">{movie.title}</h1>

          {/* Movie Details */}
          <div className="space-y-4">
            {[
              { label: "Description", value: movie.fullplot },
              { label: "Genres", value: movie.genres.join(", ") },
              { label: "Actors", value: movie.cast.join(", ") },
              { label: "Directors", value: movie.directors },
              { label: "Languages", value: movie.languages.join(", ") },
              { label: "Nationality", value: movie.countries.join(", ") },
              { label: "Year", value: movie.year },
              { label: "Duration", value: `${movie.runtime} mins` },
              { label: "Age recommendation", value: `${movie.age}+` },
            ].map((item, index) => (
              <p key={index} className="text-lg text-left">
                <span className="font-semibold text-green-300">{item.label}:</span> {item.value}
              </p>
            ))}
            {renderRatingSystem()}
          </div>
        </div>
      </div>
      <div>
        <div className="bg-gray-900 text-white p-6">
          <h2 className="text-2xl font-bold mb-4">Similar Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {similarMovies.map((movie) => (
              <div key={movie._id} className="bg-gray-800 p-4 rounded-lg">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-auto rounded-lg"
                />
                <h3 className="mt-2 text-center text-white">{movie.title}</h3>
                <Link to={`/movie/${movie._id}`}> {/* Updated to use Link */}
                  <button className="bg-green-500 px-6 py-2 mt-4 rounded-lg">View Now</button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
