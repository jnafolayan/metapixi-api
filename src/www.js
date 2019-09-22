import http from 'http';

import app from './app';

const server = http.createServer(app);
server.listen(8080, () => console.log('Server is up and running'));
