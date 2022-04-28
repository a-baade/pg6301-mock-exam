import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { fetchJSON } from "./http";
import {
  Login,
  LoginMicrosoft,
  LoginCallbackGoogle,
  LoginCallbackMicrosoft,
  ProfileContext,
} from "./login";
import { FrontPage } from "./frontPage";
import { Profile } from "./profile";

function Application() {
  const [loading, setLoading] = useState(true);
  const [login, setLogin] = useState();
  const [loggedIn, setLoggedIn] = useState();
  useEffect(() => {
    loadingLogin();
  }, []);

  async function loadingLogin() {
    setLoading(true);
    const config = await fetchJSON("/api/config");

    const loginGoogle = await fetchJSON("/api/login/google");
    const loginMicrosoft = await fetchJSON("/api/login/microsoft");

    let userinfo;

    if (loginGoogle.userinfo) {
      userinfo = loginGoogle.userinfo;
    } else if (loginMicrosoft.userinfo) {
      userinfo = loginMicrosoft.userinfo;
    }

    if (userinfo !== undefined) {
      setLoggedIn(true);
    }
    setLogin({ config, userinfo });
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
          <Route path={"/login/microsoft"} element={<LoginMicrosoft />} />
          <Route
            path={"/login/google/callback"}
            element={<LoginCallbackGoogle reload={loadingLogin} />}
          />
          <Route
            path={"/login/microsoft/callback"}
            element={<LoginCallbackMicrosoft reload={loadingLogin} />}
          />
        </Routes>
      </BrowserRouter>
    </ProfileContext.Provider>
  );
}

ReactDOM.render(<Application />, document.getElementById("app"));
