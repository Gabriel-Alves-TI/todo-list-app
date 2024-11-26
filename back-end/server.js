const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Servidor está rodando em HTTP://18.191.114.59${port}`);
});