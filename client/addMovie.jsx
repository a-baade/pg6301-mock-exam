import React, { useState } from "react";

export function AddNewMovie() {
  const [title, setTitle] = useState("");
  const [plot, setPlot] = useState("");
  const [country, setCountry] = useState("");
  const [poster, setPoster] = useState("");
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
        poster,
      }),
    });
    setTitle("");
  }

  return (
    <form onSubmit={handleNewMovie}>
      <h2>Add new movie</h2>
      <div>
        <input
          title={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <input
          plot={plot}
          placeholder="Plot"
          onChange={(e) => setPlot(e.target.value)}
        />
      </div>
      <div>
        <input
          country={country}
          placeholder="Country"
          onChange={(e) => setCountry(e.target.value)}
        />
      </div>
      <div>
        <input
          type="number"
          max="10"
          min="0"
          placeholder="Rating"
          rating={plot}
          onChange={(e) => setRating(e.target.value)}
        />
        <div>
          <div>
            <label htmlFor="filePicker">Choose Poster</label>
          </div>
          <input
            id="filePicker"
            type="file"
            poster={poster}
            placeholder="Poster"
            accept="image/png, image/jpeg"
            onChange={(e) => setPoster(e.target.value)}
          />
        </div>
      </div>
      <input type="submit" value="Submit" />
    </form>
  );
}
