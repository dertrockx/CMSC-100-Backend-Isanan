const Fastify = require("fastify");
const {routes} = require('./route');
const { connect } = require('./db');
const swagger = require('fastify-swagger');
const { definitions } = require('./definitions');
const { name: title, description, version } = require('./package.json');
const sensible = require('fastify-sensible');
const { errorHandler } = require('./error-handler');


exports.build = async(opts = {logger:false,trustProxy:false}) =>
{
    const app = Fastify(opts);
    
    app.register(sensible).after(() => {
      app.setErrorHandler(errorHandler);
    });
  
    app.register(swagger, {
        routePrefix: '/docs',
        exposeRoute: true,
        swagger: {
          info: {
            title,
            description,
            version
          },
          schemes: ['http', 'https'],
          consumes: ['application/json'],
          produces: ['application/json'],
          definitions
        }
      });
    
    await connect();
    routes(app);
    return app;
}




