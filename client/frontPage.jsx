import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { LoginRoutes } from "./loginPage";
import { ProfileContext } from "./login";

export async function handleLogout() {
  await fetch("/api/login/", { method: "delete" });
  window.location.reload();
}

export function FrontPage({ reload }) {
  const { userinfo } = useContext(ProfileContext);

  return (
    <div>
      {!userinfo && <LoginRoutes />}
      {userinfo && (
        <div>
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
          <div>
            <Link to={"/movies"}>Movies</Link>
          </div>
        </div>
      )}
    </div>
  );
}
