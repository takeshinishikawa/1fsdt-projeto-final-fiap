export const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API de Veículos',
        version: '1.0.0',
        description: 'API para cadastro de veículos'
      }
    },
    apis: ['./src/routes/*.ts']
  };
  