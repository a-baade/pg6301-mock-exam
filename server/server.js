import express from "express";
import * as path from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser(process.env.COOKIE_SECRET));

const oauth_config_google = {
  discovery_endpoint:
    "https://accounts.google.com/.well-known/openid-configuration",
  client_id: process.env.CLIENT_ID_GOOGLE,
  scope: "openid email profile",
};

const oauth_config = {
  google: oauth_config_google,
};

async function fetchJSON(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`Failed ${res.status}`);
  }
  return await res.json();
}

app.delete("/api/login", (req, res) => {
  res.clearCookie("access_token");
  res.sendStatus(200);
});

app.get("/api/login/google", async (req, res) => {
  const { access_token } = req.signedCookies;
  const discoveryEndpoint = await fetchJSON(
    oauth_config.google.discovery_endpoint
  );
  const { userinfo_endpoint } = discoveryEndpoint;

  let userinfo = undefined;
  try {
    userinfo = await fetchJSON(userinfo_endpoint, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
  } catch (error) {
    console.log({ error });
  }
  res.json({ userinfo, oauth_config: oauth_config_google }).status(200);
});

app.post("/api/login/google", (req, res) => {
  const { access_token } = req.body;
  res.cookie("access_token", access_token, { signed: true });
  res.sendStatus(200);
});

app.use(express.static("../client/dist"));

app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    res.sendFile(path.resolve("../client/dist/index.html"));
  } else {
    next();
  }
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Started on http://localhost:${server.address().port}`);
});
