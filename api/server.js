const jsonServer = require("json-server");
const fs = require("fs");
const os = require("os");
const path = require("path");

const seedFile = path.join(__dirname, "..", "db.json");

const isServerless = Boolean(process.env.VERCEL);
const dbFile = isServerless ? path.join(os.tmpdir(), "db.json") : seedFile;

if (isServerless && !fs.existsSync(dbFile)) {
  fs.copyFileSync(seedFile, dbFile);
}

const server = jsonServer.create();
const router = jsonServer.router(dbFile);
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
