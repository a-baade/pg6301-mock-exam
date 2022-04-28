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
  const { microsoft } = useContext(ProfileContext).config;
  useEffect(() => {
    async function handleAuthorizeCode() {
      const { discovery_endpoint, client_id, scope, response_type } = microsoft;
      const discoveryEndpoint = await fetchJSON(discovery_endpoint);
      const { authorization_endpoint } = discoveryEndpoint;

      const state = randomString(50);
      window.sessionStorage.setItem("authorization_state", state);
      const code_verifier = randomString(50);
      window.sessionStorage.setItem("code_verifier", code_verifier);

      const parameters = {
        response_type: "code",
        response_mode: "fragment",
        state,
        client_id,
        scope,
        code_challenge: await sha256(code_verifier),
        code_challenge_method: "S256",
        redirect_uri: window.location.origin + "/login/microsoft/callback",
        domain_hint: "egms.no",
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
  const navigate = useNavigate();
  const [error, setError] = useState();
  const { microsoft } = useContext(ProfileContext).config;
  const { discovery_endpoint, client_id } = microsoft;
  useEffect(() => {
    async function handleCallbackMicrosoft() {
      const { access_token, error, error_description, state, code } =
        Object.fromEntries(
          new URLSearchParams(window.location.hash.substring(1))
        );
      const expectedState = window.sessionStorage.getItem(
        "authorization_state"
      );
      let accessToken = access_token;

      if (state !== expectedState) {
        setError("Invalid callback - state mismatch");
      } else if (error || error_description) {
        setError(`Error: ${error} ${error_description}`);
      } else if (code) {
        const grant_type = "authorization_code";
        const code_verifier = window.sessionStorage.getItem("code_verifier");
        const redirect_uri =
          window.location.origin + "/login/microsoft/callback";
        const { token_endpoint } = await fetchJSON(discovery_endpoint);

        const parameters = {
          client_id,
          grant_type,
          code,
          code_verifier,
          redirect_uri,
        };
        const tokenResponse = await fetch(token_endpoint, {
          method: "post",
          body: new URLSearchParams(parameters),
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
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ access_token: accessToken }),
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
  const { google } = useContext(ProfileContext).config;
  useEffect(() => {
    async function handleAuthorizeToken() {
      const { discovery_endpoint, client_id, scope } = google;
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

      const res = await fetch("/api/login", {
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
