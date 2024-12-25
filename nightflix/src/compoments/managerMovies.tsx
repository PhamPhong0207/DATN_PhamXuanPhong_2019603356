import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';
interface Movie {
  id: number;
  _id: string;
  title: string;
  plot: string;
  genres: string[];
  year: number;
}

const MovieManager: React.FC = () => {
  
  const [movies, setMovies] = useState<Movie[]>([]);

  const [newMovie, setNewMovie] = useState<Movie>({
    id: 0,
    _id: '',
    title: '',
    plot: '',
    genres: [],
    year: 0
  });
  const [editMovie, setEditMovie] = useState<Movie | null>(null);
  
  useEffect(() => {
    // Lấy danh sách phim từ API
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/Hot');
        const data = await response.json();
        setMovies(data.movies);
        console.log(data)
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMovie({
      ...newMovie,
      [name]: value,
    });
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMovie),
      });
      const data = await response.json();
      setMovies([...movies, data.movie]); // Assuming the API returns the created movie
      setNewMovie({
        id: 0,
        _id: '',
        title: '',
        plot: '',
        genres: [],
        year: 0,  
      }); // Reset new movie form
    } catch (error) {
      console.error('Error creating movie:', error);
    }
  };

  const handleEdit = (movie: Movie) => {
    setEditMovie(movie);
  };

  const handleUpdate = async () => {
    if (editMovie) {
      try {
        const response = await fetch(`http://localhost:3000/api/movies/${editMovie._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: editMovie.title,
            plot: editMovie.plot,
            genres: editMovie.genres
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setMovies(movies.map(movie => 
            movie._id === editMovie._id ? data.movie : movie
          ));
          setEditMovie(null);
          alert('Movie updated successfully');
        } else {
          const error = await response.json();
          alert(error.message || 'Failed to update movie');
        }
      } catch (error) {
        console.error('Error updating movie:', error);
        alert('Error updating movie');
      }
    }
  };
  
  // ... existing code ...
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/movies/${id}`, {
          method: 'DELETE',
        });

        if (response.status === 204) {
          // Remove the movie from the local state
          setMovies(movies.filter(movie => movie._id !== id));
          alert('Movie deleted successfully');
        } else {
          const data = await response.json();
          alert(data.message || 'Failed to delete movie');
        }
      } catch (error) {
        console.error('Error deleting movie:', error);
        alert('Error deleting movie');
      }
    }
  };
  

  return (
    <div className="p-4 max-w-3xl mx-auto ">
      <Navigation />
      <h1 className="text-2xl font-bold mb-4">Movie Manager</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Title</th>
            <th className="border border-gray-300 px-4 py-2">Genre</th>
            <th className="border border-gray-300 px-4 py-2">Year</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
       
        <tbody>
          {movies.map((movie) => (
            <tr key={movie.id} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{movie._id}</td>
              <td className="border border-gray-300 px-4 py-2">{movie.title}</td>
              <td className="border border-gray-300 px-4 py-2">{movie.genres.join(", ")}</td>
              <td className="border border-gray-300 px-4 py-2">{movie.year}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleEdit(movie)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(movie._id)}
                  className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Create Movie Form */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Add New Movie</h2>
        <input
          type="text"
          name="title"
          value={newMovie.title}
          onChange={handleChange}
          placeholder="Title"
          className="border px-4 py-2 mb-2 w-full"
        />
        <textarea
          name="plot"
          value={newMovie.plot}
          onChange={(e) => setNewMovie({...newMovie, plot: e.target.value})}
          placeholder="Plot"
          className="border px-4 py-2 mb-2 w-full h-32"
        />
        <input
          type="text"
          name="genres"

          value={Array.isArray(newMovie.genres) ? newMovie.genres.join(',') : newMovie.genres}
          onChange={handleChange}
          placeholder="Genres (comma-separated)"
          className="border px-4 py-2 mb-2 w-full"
        />
        <input
          type="number"
          name="year"
          value={newMovie.year}
          onChange={(e) => setNewMovie({...newMovie, year: Number(e.target.value)})}
          placeholder="Year"
          className="border px-4 py-2 mb-2 w-full"
        />
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
        >
          Add Movie
        </button>
      </div>

      {/* Edit Movie Form font end */}
      {editMovie && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Edit Movie</h2>
          <input
            type="text"
            name="title"
            value={editMovie.title}
            onChange={(e) => setEditMovie({ ...editMovie, title: e.target.value })}
            className="border px-4 py-2 mb-2 w-full"
          />
          <textarea
            name="plot"
            value={editMovie.plot}
            onChange={(e) => setEditMovie({ ...editMovie, plot: e.target.value })}
            className="border px-4 py-2 mb-2 w-full h-32"
          />
          <input
            type="text"
            name="genres"
            value={editMovie.genres.join(',')}
            onChange={(e) => setEditMovie({ ...editMovie, genres: e.target.value.split(',') })}
            className="border px-4 py-2 mb-2 w-full"
            placeholder="Genre (comma-separated)"
          />
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
          >
            Update Movie 
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieManager;
