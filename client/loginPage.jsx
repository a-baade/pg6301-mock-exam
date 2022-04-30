import React from "react";
import { Link } from "react-router-dom";

export function LoginRoutes() {
  return (
    <div>
      <div>
        <div>
          <Link to={"/login/google"}>Log-in via your Google account </Link>
        </div>
        <div>
          <Link to={"/login/microsoft"}>Log-in via your School account</Link>
        </div>
      </div>
    </div>
  );
}
