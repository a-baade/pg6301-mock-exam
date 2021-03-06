import React from "react";
import { fetchJSON } from "./http";
import { postJSON } from "./http";

export const MoviesApiContext = React.createContext({
  async fetchLogin() {
    return await fetchJSON("/api/login");
  },
  async listMovies(query) {
    return await fetchJSON("/api/movies?" + new URLSearchParams(query));
  },
  async createMovie(movie) {
    return await postJSON("/api/movies/add", movie);
  },
  async registerLogin(provider, login) {
    return await postJSON(`/api/login/${provider}`, login);
  },
  async endSession() {
    const res = await fetch("/api/login", { method: "DELETE" });
    if (!res.ok) {
      throw new Error(`Failed to post ${res.status}: ${res.statusText}`);
    }
  },
});
