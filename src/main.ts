import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from './generated/routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Serve Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(require('./generated/swagger.json')));

// Create a router for the /api/v1 prefix
const apiRouter = express.Router();

// Register tsoa routes
RegisterRoutes(apiRouter);

// Apply the /api/v1 prefix to all routes
app.use('/api/v1', apiRouter);

const PORT = process.env.PORT || 3000;;

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});