const jsonServer = require("json-server");
const db = require("../db.json");

const server = jsonServer.create();
const router = jsonServer.router(db);
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
  }),
);
server.use(router);

if (require.main === module) {
  server.listen(3000, () => {
    console.log("JSON Server is running on port 3000");
  });
}

module.exports = server;
