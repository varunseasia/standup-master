import express from 'express';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import repoRoutes from './routes/repo.routes.js';
dotenv.config();
const app = express();

app.use(express.json());
app.use('/api', apiRoutes);
app.use('/repo', repoRoutes);
app.use(errorHandler);

export default app;