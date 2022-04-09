import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { fetchJSON } from "./http";
import { Login, LoginCallback, ProfileContext } from "./login";
import { FrontPage } from "./frontPage";
import { Profile } from "./profile";

function Application() {
  const [loading, setLoading] = useState(true);
  const [login, setLogin] = useState();
  useEffect(() => {
    loadingLogin();
  }, []);

  async function loadingLogin() {
    setLoading(true);
    setLogin(await fetchJSON("/api/login/google"));
    setLoading(false);
  }

  useEffect(() => {
    console.log({ login });
  }, [login]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ProfileContext.Provider value={login}>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<FrontPage reload={loadingLogin} />} />
          <Route path={"/profile"} element={<Profile />} />
          <Route path={"/login/google"} element={<Login />} />
          <Route
            path={"/login/google/callback"}
            element={<LoginCallback reload={loadingLogin} />}
          />
        </Routes>
      </BrowserRouter>
    </ProfileContext.Provider>
  );
}

ReactDOM.render(<Application />, document.getElementById("app"));
