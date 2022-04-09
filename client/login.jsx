import React, { useContext, useEffect, useState } from "react";
import { fetchJSON } from "./http";
import { useNavigate } from "react-router-dom";

export const ProfileContext = React.createContext({
  userinfo: undefined,
});

export function Login() {
  const { oauth_config } = useContext(ProfileContext);
  useEffect(() => {
    async function handleAuthorize() {
      const { discovery_endpoint, client_id, scope } = oauth_config;
      const discoveryEndpoint = await fetchJSON(discovery_endpoint);
      const { authorization_endpoint } = discoveryEndpoint;
      const parameters = {
        response_type: "token",
        response_mode: "fragment",
        client_id,
        scope,
        redirect_uri: window.location.origin + "/login/google/callback",
      };
      window.location.href =
        authorization_endpoint + "?" + new URLSearchParams(parameters);
    }

    handleAuthorize();
  }, []);

  return (
    <div>
      <h1>Please wait...</h1>
    </div>
  );
}

export function LoginCallback({ reload }) {
  const [error, setError] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    async function handleCallback() {
      const { access_token } = Object.fromEntries(
        new URLSearchParams(window.location.hash.substring(1))
      );
      console.log(access_token);

      const res = await fetch("/api/login/google", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ access_token }),
        //body: new URLSearchParams({access_token})
      });
      if (res.ok) {
        reload();
        navigate("/");
      } else {
        setError(
          `Failed POST /api/login/google: ${res.status} ${res.statusText}`
        );
      }
    }

    handleCallback();
  }, []);

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <div>{error}</div>
      </div>
    );
  }

  return <h1>Please wait...</h1>;
}
