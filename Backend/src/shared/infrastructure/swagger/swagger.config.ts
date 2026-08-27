import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AutoVersus API Documentation',
      version: '1.0.0',
      description: 'Modular Monolith API for AutoVersus Automotive Intelligence Platform (Egypt & MENA)',
      contact: {
        name: 'AutoVersus Engineering Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [
    './src/modules/**/*.routes.ts',
    './src/modules/**/*.controller.ts',
    './src/app.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
