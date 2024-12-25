import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Database from './lib/mongodb';
import { ObjectId } from 'mongodb';


const app = express();
const PORT = 3000;
app.use(cors({ origin: 'http://localhost:5173' }));
dotenv.config();
app.use(express.json());
app.get('/api/Drama', async (req: Request, res: Response) => {
  let db = Database.getInstance();
  await db.connect();
  const movies = await db.getCollection('movies');
  const movie_drama = await movies.find({
    year: { $gt: 2010 },
    genres: 'Drama',

    "imdb.rating": { $gt: 6.5 } // Truy cập giá trị "rating" bên trong object "imdb"
  }).limit(12).toArray();
  res.json({
    movies: movie_drama
  });
  console.log(movie_drama)
});
app.get('/api/Action', async (req: Request, res: Response) => {
  let db = Database.getInstance();
  await db.connect();
  const movies = await db.getCollection('movies');
  const movie_action = await movies.find({
    genres: 'Action',
    year: { $gt: 2010 },
    "imdb.rating": { $gt: 6.5 } // Truy cập giá trị "rating" bên trong object "imdb"
  }).limit(12).toArray();
  res.json({
    movies: movie_action

  });
  console.log(movie_action)
});
app.get('/api/Comedy', async (req: Request, res: Response) => {
  let db = Database.getInstance();
  await db.connect();
  const movies = await db.getCollection('movies');
  const movie_comedy = await movies.find({
    genres: 'Comedy',
    year: { $gt: 2010 },
    "imdb.rating": { $gt: 6.5 } // Truy cập giá trị "rating" bên trong object "imdb"
  }).limit(12).toArray();
  res.json({
    movies: movie_comedy

  });
  console.log(movie_comedy)
});
app.get('/api/Horror', async (req: Request, res: Response) => {
  let db = Database.getInstance();
  await db.connect();
  const movies = await db.getCollection('movies');
  const movie_horror = await movies.find({
    genres: 'Horror',
    year: { $gt: 2010 },
    "imdb.rating": { $gt: 6.5 } // Truy cập giá trị "rating" bên trong object "imdb"
  }).limit(12).toArray();
  res.json({
    movies: movie_horror

  });
  console.log(movie_horror)
});
app.get('/api/Hot', async (req: Request, res: Response) => {
  let db = Database.getInstance();
  await db.connect();
  const movies = await db.getCollection('movies');
  const movie_Hot = await movies.find({
    year: { $gt: 2010 },
    "imdb.votes": { $exists: true, $ne: '' }, // Truy cập giá trị "rating" bên trong object "imdb"
  })
    .sort({ "imdb.votes": -1 })
    .limit(12).toArray();
  res.json({
    movies: movie_Hot

  });
  console.log(movie_Hot)
});


app.get('/api/movies/:id', async (req: Request, res: Response) => {
  let db = Database.getInstance();
  await db.connect();
  const movie = await db.getCollection('movies');
  const inforMovie = await movie.findOne({ _id: new ObjectId(req.params.id) }); // Use req.params.id and convert to ObjectId

  if (inforMovie) {
    res.json(inforMovie); // Send the movie information as a response
  } else {
    res.status(404).json({ error: 'Movie not found' }); // Handle case where movie is not found
  }
});

// app.put('/api/movies', async (req: Request, res: Response) => {
//   let db = Database.getInstance();
//   await db.connect();
//   const movies = await db.getCollection('movies');
//   const movie_2001 = await movies.updateMany( 
//     { year: { $lt: 2001 } },
//     {
//       $set: {  year: 2001 }
//     }
//   );
//   res.json({
//     movies: movie_2001
//   });

// });
app.get('/api/Search', async (req: Request, res: Response) => {
  let db = Database.getInstance();
  await db.connect();
  const movies = await db.getCollection('movies');
  const query = req.query.q; // Assuming the query parameter is named 'q'
  const movie_Search = await movies
    .find({ title: { $regex: query, $options: 'i' } })
    .sort({ "imdb.rating": -1 })// sắp xếp theo điểm rating từ cao xuông thấp
    .limit(12).toArray();
  res.json({
    movies: movie_Search
  });
  try {
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });

  }

});

//{ADMIN Manager Movies}
app.get('/api/getMovies', async (req, res) => {
  try {
    let db = Database.getInstance();
    await db.connect();
    const movies = await db.getCollection('movies');
    const listMovie=await movies.find({year:{$gt :2016}}).limit(16);

    res.status(200).json(listMovie);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

app.get('/api/getMovies', async (req, res) => {
  try {
    let db = Database.getInstance();
    await db.connect();
    const movies = await db.getCollection('movies');
    const listMovie=await movies.find({year:{$gt :2016}}).limit(16);

    res.status(200).json(listMovie);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});



app.delete('/api/movies/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let db = Database.getInstance();
    await db.connect();
    const collection = await db.getCollection('movies');
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Movie not found' });
    }

    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
});
// Update Movie endpoint
// Update Movie endpoint
app.put('/api/movies/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let db = Database.getInstance();
    await db.connect();
    const movies = await db.getCollection('movies');
    
    const { title, year, genres, poster, plot, rate } = req.body;
    
    const result = await movies.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: {
          title,
          year: Number(year),
          genres: Array.isArray(genres) ? genres : genres.split(','),
          poster: poster || '',
          plot: plot || '',
          rate: Number(rate) || 0,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );
    if (!result) {
       res.status(404).json({ message: 'Movie not found' });
    }
    res.json({ movie: result });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update movie' });
  }}
 );

// Recommendation Movies
app.get('/similar/:movieId', async (req, res) => {
  try {
      const { movieId } = req.params;
      let db = Database.getInstance();
      await db.connect();
      const movies = await db.getCollection('movies');
      const similarMovies = movies.aggregate([
        // First, match the source movie by its _id
        {
            $match: { 
                _id: new ObjectId(movieId) // Specific movie ID
            }
        },
        // Lookup similar movies
        {
            $lookup: {
                from: "movies",
                let: { 
                    movieGenres: { $ifNull: ["$genres", []] }, // Ensure genres is an array
                    movieAge: "$age",
                    movieId: "$_id"
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    // Exclude the current movie
                                    { $ne: ["$_id", "$$movieId"] },
                                    // Match movies with the same age rating
                                    { $eq: ["$age", "$$movieAge"] },
                                    // Match movies with at least one matching genre
                                    {
                                        $gt: [
                                            { 
                                                $size: { 
                                                    $setIntersection: [
                                                        { $ifNull: ["$genres", []] }, // Ensure genres is an array
                                                        "$$movieGenres"
                                                    ] 
                                                } 
                                            },
                                            0
                                        ]
                                    },
                                    // Add condition to check for poster existence
                                    { $ne: ["$poster", null] },
                                    { $ne: ["$poster", ""] }
                                ]
                            }
                        }
                    },
                    // Add similarity score based on matching genres
                    {
                        $addFields: {
                            similarityScore: {
                                $size: { 
                                    $setIntersection: [
                                        { $ifNull: ["$genres", []] }, // Ensure genres is an array
                                        "$$movieGenres"
                                    ]
                                }
                            }
                        }
                    },
                    // Sort by similarity score
                    { $sort: { similarityScore: -1, "imdb.rating": -1 } },
                    // Limit to 10 results
                    { $limit: 8 },
                    // Project only needed fields
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            poster: 1,
                            genres: 1,
                            age: 1,
                            year: 1,
                            similarityScore: 1
                        }
                    }
                ],
                as: "similarMovies"
            }
        },
        // Get only the similar movies array
        {
            $project: {
                similarMovies: 1
            }
        }
    ]);
    const similar = await similarMovies.toArray();

      res.json(similar[0]?.similarMovies || []);
  } catch (error: any) {
      console.error('Error fetching similar movies:', error);
      res.status(500).json({ 
          error: 'Error fetching similar movies',
          message: error.message 
      });
  }
});

// Add Movie endpoint
app.post('/api/movies', async (req: Request, res: Response) => {
  try {
    let db = Database.getInstance();
    await db.connect();
    const movies = await db.getCollection('movies');
    
    const { title, year, genres, poster, plot, rate } = req.body;
    
    if (!title || !year || !genres) {
       res.status(400).json({ message: 'Title, year, and genres are required' });
    }

    const newMovie = {
      title,
      year: Number(year),
      genres: Array.isArray(genres) ? genres : genres.split(','),
      poster: poster || '',
      plot: plot || '',
      rate: Number(rate) || 0,
      createdAt: new Date()
    };

    const result = await movies.insertOne(newMovie);
    
    res.status(201).json({
      success: true,
      movie: { ...newMovie, _id: result.insertedId }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create movie' });
  }
});

// Add rating to a movie
app.post('/api/movies/:id/ratings', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, rating, comment } = req.body;

    // Validate input
    if (!username || !rating || !comment) {
       res.status(400).json({ message: 'All fields are required' });
    }

    if (rating < 1 || rating > 5) {
       res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    let db = Database.getInstance();
    await db.connect();
    const movies = await db.getCollection('movies');

    // Update movie document with new rating
    const result = await movies.updateOne(
      { _id: new ObjectId(id) },
      {
        $push: {
          ratings: {
            $each: [{
              username: String(username),
              rating: Number(rating),
              comment: String(comment),
              createdAt: new Date()
            }]
          } as any
        }
      }
    );

    if (result.modifiedCount === 0) {
       res.status(404).json({ message: 'Movie not found' });
    }

    res.status(201).json({ message: 'Rating added successfully' });

  } catch (error) {
    console.error('Error adding rating:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all ratings for a movie
app.get('/api/movies/:id/ratings', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    let db = Database.getInstance();
    await db.connect();
    const movies = await db.getCollection('movies');

    const movie = await movies.findOne(
      { _id: new ObjectId(id) },
      { projection: { ratings: 1 } }
    );
    
    if (!movie) {
      res.status(404).json({ message: 'Movie not found' });
      return; // Add return statement after sending response
    }

    res.json(movie.ratings || []);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add this endpoint to handle rating deletion
app.delete('/api/movies/:id/ratings/:index', async (req: Request, res: Response) => {
  try {
    const { id, index } = req.params;
    
    let db = Database.getInstance();
    await db.connect();
    const movies = await db.getCollection('movies');

    // Get the movie first
    const movie = await movies.findOne({ _id: new ObjectId(id) });
    
    if (!movie || !movie.ratings) {
      res.status(404).json({ message: 'Movie or ratings not found' });
      return;
    }

    // Remove the rating at the specified index
    const ratings = movie.ratings;
    if (Number(index) >= 0 && Number(index) < ratings.length) {
      ratings.splice(Number(index), 1);
      
      // Update the movie with the new ratings array
      const result = await movies.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ratings: ratings } }
      );

      if (result.modifiedCount === 0) {
        res.status(404).json({ message: 'Failed to update movie' });
        return;
      }

      res.status(200).json({ message: 'Rating deleted successfully' });
    } else {
      res.status(400).json({ message: 'Invalid rating index' });
    }
  } catch (error) {
    console.error('Error deleting rating:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
