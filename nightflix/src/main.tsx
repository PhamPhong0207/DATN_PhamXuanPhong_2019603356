import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import DramaMovies from './compoments/Drama.tsx'
import Action from './compoments/Action.tsx'
import ComedyMovies from './compoments/Comedy.tsx'
import HorrorMovies from './compoments/Horror.tsx'
import HotMovies from './compoments/hotMovie.tsx'
import SearchMovies from './compoments/SearchResults.tsx'
import Login from './compoments/Login.tsx'
import Register from './compoments/Register.tsx'
import PrivateRoute from './compoments/PrivateRoute.tsx'
import AdminDashboard from './compoments/AdminManager.tsx'
import MovieDetails from './compoments/MovieDetails.tsx'
import MovieManager from './compoments/managerMovies.tsx'
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/Drama",
    element: <DramaMovies />,
  },
  {
    path: "/Action",
    element: <Action />,
  },
  {
    path: "/Comedy",
    element: <ComedyMovies />,
  },
  {
    path: "/Horror",
    element: <HorrorMovies />,
  },
  {
    path: "/Hot",
    element: <HotMovies />,
  },

  {
    path: "/Search",
    element: <SearchMovies />,

  }
  ,
  {
    path: "/Login",
    element: <Login />,

  },
  {
    path: "/Register",
    element: <Register />,
  },
  {
    path: "/admin",
    element: <PrivateRoute role="admin"><AdminDashboard /> </PrivateRoute>,
  },
  {
    path: "/movie/:id", element: <MovieDetails />
  },
  {
    path: "/movieManager", element:<MovieManager/>
  },


]);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
