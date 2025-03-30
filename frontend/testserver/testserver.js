const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Custom middleware to log requests
server.use((req, res, next) => {
    console.log('Request received:', req.method, req.url);
    next();
});

server.use(router);
server.listen(5001, () => {
    console.log('JSON Server is running');
});