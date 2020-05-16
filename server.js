// This is the server file, which starts the entire application.
// It requires nodeJS, and then it runs the application on port 3000
// It uses NextJS and Express, and it wraps Express inside NextJS to
// enable backend API inside the same application
// CORS is used to enable intercommunication between front-end and API

const express = require("express");
const server = express();
const cors = require("cors");
server.use(cors());
const next = require("next");
const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare(cors()).then(() => {
  server.use(express.json({ extended: false }));
  server.use(express.urlencoded({ extended: true }));
  // WARNING! Errors may show if the routes files don't have module.exports = router;
  server.use("/auth", require("./routes/metaAuth"));
  server.use("/db", require("./routes/dbQueries"));
  server.use("/vote", require("./routes/vote"));

  // Global error handling through middleware
  server.use((err, req, res, next) => {
    console.log(err.stack);
    if (err.statusCode) {
      return res.status(err.statusCode).send(err.message);
    }
    res.status(500).send(err.message);
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
