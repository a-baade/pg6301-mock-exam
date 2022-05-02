import React, { useContext, useEffect, useState } from "react";
import { fetchJSON, useLoader } from "./http";
import { MoviesApiContext } from "./moviesApiContext";

function MovieCard({
  movie: { title, imdb, poster, plot, countries, directors },
}) {
  return (
    <>
      <h2>{title}</h2>
      {imdb && <p>Rating: {imdb.rating}</p>}
      {poster && (
        <img src={poster} style={{ width: "200px" }} alt={"Movie poster"} />
      )}
      <h3>Director: {directors}</h3>
      <h4>Countries: {countries}</h4>
      <h5>Plot:</h5>
      <p>{plot}</p>
    </>
  );
}

export function ListMovies() {
  const { listMovies } = useContext(MoviesApiContext);
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    if (search === "") {
      fetchJSON("/api/movies").then(() => {
        setData(listMovies);
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
