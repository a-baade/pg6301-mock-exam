import { Router } from "express";

export function MoviesApi(mongoDB) {
  const router = new Router();

  router.get("/", async (req, res) => {
    const movies = await mongoDB
      .collection("movies")
      .find()
      .sort({
        metacritic: -1,
      })
      .map(({ title, year, plot, genre, poster, countries }) => ({
        title,
        year,
        plot,
        genre,
        poster,
        countries,
      }))
      .limit(50)
      .toArray();
    res.json(movies);
  });

  router.post("/new", (req, res) => {
    res.sendStatus(500);
  });

  router.post("/add", (req, res) => {
    const { title, country, year, plot } = req.body;
    console.log(req.body);

    mongoDB.collection("movies").insertOne({
      title,
      country,
      year,
      plot,
    });
    res.sendStatus(200);
  });

  router.get("/search/*", async (req, res) => {
    const title = req.query.title;

    const movies = await mongoDB
      .collection("movies")
      .find({
        title: new RegExp(title, "i"),
      })
      .sort({
        metacritic: -1,
      })
      .map(({ title, plot, poster, imdb }) => ({
        title,
        plot,
        poster,
        imdb,
      }))
      .limit(50)
      .toArray();
    if (!movies) {
      res.status(404).json({ errors });
      return;
    }
    res.json({ movies });
  });

  return router;
}
