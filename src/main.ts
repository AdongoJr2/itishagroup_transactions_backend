import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from './generated/routes';
import * as dotenv from 'dotenv';
import AppDataSource from './config/database';
import container from './config/inversify';
import { bindControllers } from './utils/inversify/controller-loader';
import logger from './utils/logger/logger';
import { errorHandler } from './middleware/error-handler.middleware';

dotenv.config();

const expressApp = express();

expressApp.use(express.json());

// Automatically bind all controllers to the DI container
bindControllers(container);

// Create a router for the /api/v1 prefix
const apiRouter = express.Router();

// Register tsoa routes on the apiRouter
RegisterRoutes(apiRouter);

apiRouter.use(errorHandler);

// Apply the /api/v1 prefix to all routes
expressApp.use('/api/v1', apiRouter);

// Log incoming requests
expressApp.use((req, res, next) => {
    const startTime = Date.now();
    const method = req.method;
    const url = req.originalUrl;

    res.on('finish', () => {
        const duration = Date.now() - startTime;
        logger.info(`Incoming request: ${method} ${url} - Response: ${res.statusCode} (${duration}ms)`);
    });

    next();
});

// Serve Swagger UI
expressApp.use('/docs', swaggerUi.serve, swaggerUi.setup(require('./generated/swagger.json')));

// Initialize the database connection
AppDataSource.initialize()
    .then(() => {
        logger.info("Database initialized successfully");
    })
    .catch((error) => {
        logger.error(`Failed to initialize database :: ${error}`);
    });

const PORT = process.env.PORT || 3000;

expressApp.listen(PORT, () => {
    logger.info(`Server is running on port: ${PORT}`);
});