const PORT = 8081;

// server
const jsonServer = require('json-server');
const server = jsonServer.create();

const path = require('path');
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);
 
// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
  res.jsonp(req.query);
});

// Add custom routes that returns http error
server.get('/error', function(req, res) {
  res.status(500).jsonp({
    error: "wtf!",
  });
});

// Add custom routee with fake data
server.get('/people', (req, res) => {
  var faker = require("faker");
  var _ = require("lodash");
  res.jsonp({
    people: _.times(100, function(n) {
      return {
        id: n,
        name: faker.name.findName(),
        avatar: faker.internet.avatar(),
      };
    })
  });
});


// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now();
  }
  // Continue to JSON Server router
  next();
});

// Use default router
server.use(router);
server.listen(PORT, () => {
  console.log(`JSON Server is running at http://localhost:${PORT}`);
});
