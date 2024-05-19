import { createServer } from 'http';
import { options } from '../../routes/swagger';
import { setupMiddleware } from '../middleware';
import { setupRoutes } from '../routes';
import cors from 'cors';
import express from 'express';
import expressJSDocSwagger from 'express-jsdoc-swagger';

const app = express();

expressJSDocSwagger(app)(options);

setupMiddleware(app);

app.use(cors());

setupRoutes(app);

const http = createServer(app);

export { http, app };
