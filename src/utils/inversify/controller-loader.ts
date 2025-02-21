import { Container } from 'inversify';
import * as glob from 'glob';
import * as path from 'path';

/**
 * Automatically binds all controllers to the DI container.
 * @param container The DI container.
 */
export function bindControllers(container: Container) {
    // Find all controller files matching the pattern
    // const controllerFiles = glob.sync('src/controllers/**/*Controller.ts');
    const controllerFiles = glob.sync('src/**/*.controller.ts');

    console.log("\nController files found:", controllerFiles);

    // Bind each controller to the container
    controllerFiles.forEach((file) => {
        const controllerClass = require(path.resolve(file)).default; // Import the controller class (should be default export)
        container.bind(controllerClass).toSelf(); // Bind the controller to itself
    });
}