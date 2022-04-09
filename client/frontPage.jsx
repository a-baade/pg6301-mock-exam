import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ProfileContext } from "./login";

export function FrontPage({ reload }) {
  const { userinfo } = useContext(ProfileContext);

  async function handleLogout() {
    await fetch("/api/login/", { method: "delete" });
    reload();
  }

  return (
    <div>
      {!userinfo && (
        <div>
          <div>
            <Link to={"/login/google"}>Log-in via your Google account </Link>
          </div>
          <div>
            <Link to={"/login/microsoft"}>Log-in via your School account</Link>
          </div>
        </div>
      )}
      {userinfo && (
        <div>
          <Link to={"/profile"}>{userinfo.name}'s Profile</Link>
        </div>
      )}
      {userinfo && (
        <div>
          <button onClick={handleLogout}>Log out</button>
        </div>
      )}
    </div>
  );
}
