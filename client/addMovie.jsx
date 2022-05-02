import React, { useContext, useState } from "react";
import { MoviesApiContext } from "./moviesApiContext";

function FormInput({ label, value, onChangeValue }) {
  return (
    <div className="form-input">
      <label>
        <strong>{label}</strong>{" "}
        <input value={value} onChange={(e) => onChangeValue(e.target.value)} />
      </label>
    </div>
  );
}

export function AddNewMovie() {
  const { createMovie } = useContext(MoviesApiContext);
  const [title, setTitle] = useState("");
  const [plot, setPlot] = useState("");
  const [country, setCountry] = useState("");
  const [year, setYear] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    createMovie({
      title,
      plot,
      year: parseInt(year),
      country,
    });
    setTitle("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add new movie</h2>

      <FormInput label="Title:" value={title} onChangeValue={setTitle} />

      <FormInput label="Plot:" value={plot} onChangeValue={setPlot} />

      <FormInput label="Country:" value={country} onChangeValue={setCountry} />

      <FormInput
        type="number"
        max="10"
        min="0"
        label="Year:"
        value={year}
        onChangeValue={setYear}
      />
      <input type="submit" value="Submit" />
    </form>
  );
}
