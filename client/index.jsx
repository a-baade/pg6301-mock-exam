import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

function FrontPage() {
  return (
    <div>
      <h1>Front Page</h1>
      <div>
        <Link to="/login">Login</Link>
      </div>
      <div>
        <Link to="/profile">Profile</Link>
      </div>
      <div>
        <button onClick={handleLogout}>Log out</button>
      </div>
    </div>
  );
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed ${res.status}`);
  }
  return await res.json();
}

function useLoader(loadingFn) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [error, setError] = useState();

  async function load() {
    try {
      setLoading(true);
      setData(await loadingFn());
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => load(), []);
  return { loading, data, error };
}

function Login() {
  const [redirectUrl, setRedirectUrl] = useState();
  useEffect(async () => {
    const { authorization_endpoint } = await fetchJSON(
      "https://accounts.google.com/.well-known/openid-configuration"
    );
    const parameters = {
      response_type: "token",
      client_id:
        "72657279278-958d8tvbqaak9cvnlk0klrqjbbooirep.apps.googleusercontent.com",
      scope: "email profile",
      redirect_uri: window.location.origin + "/login/callback",
    };
    setRedirectUrl(
      authorization_endpoint + "?" + new URLSearchParams(parameters)
    );
  }, []);

  return (
    <div>
      <h1>Please wait...</h1>
      <a href={redirectUrl}>Do login</a>
      <div>{redirectUrl}</div>
    </div>
  );
}

function LoginCallback() {
  const navigate = useNavigate();
  useEffect(() => {
    const { access_token } = Object.fromEntries(
      new URLSearchParams(window.location.hash.substring(1))
    );
    console.log(access_token);

    fetch("/api/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ access_token }),
    });
    navigate("/");
  });
  return <h1>Please wait...</h1>;
}

function handleLogout() {
  fetch("/api/logout");
  cookies.set("testtoken", { expires: Date.now() });
}

function Profile() {
  const { loading, data, error } = useLoader(async () => {
    return await fetchJSON("/api/login");
  });

  if (loading) {
    return <div>Please wait ...</div>;
  }
  if (error) {
    return <div>Error! {error.toString()}</div>;
  }
  return (
    <div>
      <h1>
        Profile for {data.name} ({data.email})
      </h1>
      <div>
        <img src={data.picture} alt="Profile picture" />
      </div>
      <div>{JSON.stringify(data)}</div>
    </div>
  );
}

function Application() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<FrontPage />} />
        <Route path={"/login"} element={<Login />} />
        <Route path={"/login/callback"} element={<LoginCallback />} />
        <Route path={"/profile"} element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.render(<Application />, document.getElementById("app"));
