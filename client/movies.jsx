import React, { useContext } from "react";
import { Login, ProfileContext } from "./login";

export function Movies() {
  const { userinfo } = useContext(ProfileContext);

  return <div>{!userinfo && <Login />}</div>;
}
