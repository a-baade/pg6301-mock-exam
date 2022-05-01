import React, { useContext, useEffect, useState } from "react";
import { Login, ProfileContext } from "./login";
import { fetchJSON, useLoader } from "./http";

function AddNewMovie() {
  const [title, setTitle] = useState("");
  const [plot, setPlot] = useState("");
  const [country, setCountry] = useState("");
  const [rating, setRating] = useState("");

  async function handleNewMovie(event) {
    event.preventDefault();

    await fetch("/api/movies/add", {
      method: "POST",
      body: new URLSearchParams({
        title,
        plot,
        country,
        rating,
      }),
    });
    setTitle("");
  }

  return (
    <form onSubmit={handleNewMovie}>
      <h1>Add new movie</h1>
      <input title={title} onChange={(e) => setTitle(e.target.value)} />
      <input plot={plot} onChange={(e) => setPlot(e.target.value)} />
      <input country={plot} onChange={(e) => setCountry(e.target.value)} />
      <input rating={plot} onChange={(e) => setRating(e.target.value)} />
      <input type="submit" value="Submit" />
    </form>
  );
}

function MovieCard({ movie: { title, imdb, poster, plot } }) {
  return (
    <>
      <h2>{title}</h2>
      {imdb && <p>Rating: {imdb.rating}</p>}
      {poster && <img src={poster} style={{ width: "200px" }} />}
      <h4>Plot:</h4>
      <p>{plot}</p>
    </>
  );
}

export function ListMovies() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    if (search === "") {
      fetchJSON("/api/movies").then((jsonData) => {
        setData(jsonData);
      });
    } else {
      fetchJSON(`/api/movies/search/?title=${search}`).then((jsonData) => {
        setData(jsonData.movies);
      });
    }
  }, [search]);

  const { error, loading } = useLoader(async () => {
    return await fetchJSON("/api/movies").then((jsonData) => {
      setData(jsonData);
    });
  });

  async function handleSearch(event) {
    await setSearch(event);
  }

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error.toString()}</div>;
  }

  return (
    <div>
      <h2>Search Movies:</h2>

      <input value={search} onChange={(e) => handleSearch(e.target.value)} />
      {search && <div>Results for {search}</div>}

      {data && (
        <div>
          {data.map((movie, index) => (
            <div key={index}>
              <MovieCard key={index} movie={movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export function Movies() {
  const { userinfo } = useContext(ProfileContext);

  return (
    <div>
      {!userinfo && <Login />}
      {userinfo && (
        <div>
          <h1>Movies</h1>
          <AddNewMovie />
          <ListMovies />
        </div>
      )}
    </div>
  );
}
