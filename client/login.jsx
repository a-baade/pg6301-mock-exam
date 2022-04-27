import React, { useContext, useEffect, useState } from "react";
import { fetchJSON } from "./http";
import { useNavigate } from "react-router-dom";

export const ProfileContext = React.createContext({
  userinfo: undefined,
});

async function sha256(string) {
  const binaryHash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder("utf-8").encode(string)
  );
  return btoa(String.fromCharCode.apply(null, new Uint8Array(binaryHash)))
    .split("=")[0]
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function randomString(length) {
  const possible = "ABCDEFGIKJKNKLBIELILNLA01234456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return result;
}

export function LoginMicrosoft() {
  const { oauth_config } = useContext(ProfileContext);
  useEffect(() => {
    async function handleAuthorizeCode() {
      const { discovery_endpoint, client_id, scope } = oauth_config;
      const discoveryEndpoint = await fetchJSON(discovery_endpoint);
      const { authorization_endpoint } = discoveryEndpoint;
      const parameters = {
        response_type: "code",
        response_mode: "fragment",
        client_id,
        scope,
        redirect_uri: window.location.origin + "/login/microsoft/callback",
      };
      window.location.href =
        authorization_endpoint + "?" + new URLSearchParams(parameters);
    }
    handleAuthorizeCode();
  }, []);

  return (
    <div>
      <h1>Please wait...</h1>
    </div>
  );
}

export function LoginCallbackMicrosoft({ reload }) {
  const [error, setError] = useState();
  const navigate = useNavigate();
  const { microsoft } = useContext(ProfileContext).config;
  const { discovery_endpoint, client_id } = microsoft;
  useEffect(() => {
    async function handleCallbackMicrosoft() {
      const expectedState = window.sessionStorage.getItem("expected_state");
      const { access_token, error, error_description, state, code, scope } =
        Object.fromEntries(new URLSearchParams(window.location.substring(1)));

      let accessToken = access_token;

      if (expectedState !== state) {
        setError("Unexpected redirect (state mismatch)");
        return;
      }
      if (error || error_description) {
        setError(`Error: ${error} ${error_description}`);
        return;
      }
      if (code) {
        const { token_endpoint } = await fetchJSON(discovery_endpoint);
        const code_verifier = window.sessionStorage.getItem("code_verifier");

        const tokenResponse = await fetchJSON(token_endpoint, {
          method: "POST",
          body: new URLSearchParams({
            code,
            grant_type: "authorization_code",
            client_id,
            code_verifier,
            redirect_uri: window.location.origin + "/login/microsoft/callback",
          }),
        });
        if (tokenResponse.ok) {
          const { access_token } = await tokenResponse.json();
          accessToken = access_token;
        } else {
          setError(`token response ${await tokenResponse.text()}`);
          return;
        }
      }
      if (!accessToken) {
        setError("Missing access token");
        return;
      }

      const res = await fetch("/api/login", {
        method: "post",
        body: new URLSearchParams({ access_token: accessToken }),
      });

      if (res.ok) {
        reload();
        navigate("/");
      } else {
        setError(`Failed POST /api/login: ${res.status} ${res.statusText}`);
      }
    }
    handleCallbackMicrosoft();
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

export function Login() {
  const { oauth_config } = useContext(ProfileContext);
  useEffect(() => {
    async function handleAuthorizeToken() {
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
    handleAuthorizeToken();
  }, []);

  return (
    <div>
      <h1>Please wait...</h1>
    </div>
  );
}

export function LoginCallbackGoogle({ reload }) {
  const [error, setError] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    async function handleCallbackGoogle() {
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
    handleCallbackGoogle();
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
