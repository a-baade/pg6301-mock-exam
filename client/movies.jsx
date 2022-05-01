import React, { useContext } from "react";
import { Login, ProfileContext } from "./login";
import { AddNewMovie } from "./addMovie";
import { ListMovies } from "./listMovies";

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
