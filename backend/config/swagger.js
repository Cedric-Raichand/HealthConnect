const swaggerJsdoc = require("swagger-jsdoc");


const swaggerUi = require("swagger-ui-express");


const options = {

  definition: {

    openapi: "3.0.0",

    info: {

      title: "HealthConnect API",

      version: "1.0.0",

      description:
        "Healthcare management API for patients, doctors, appointments, medical records and prescriptions",

    },

    servers: [

      {
        url: "http://localhost:5000",
        description: "Development server",
      },

    ],

  },


  apis: [
    "./routes/*.js",
  ],

};



const swaggerSpec = swaggerJsdoc(options);



module.exports = {
  swaggerUi,
  swaggerSpec,
};