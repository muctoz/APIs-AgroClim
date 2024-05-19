const express = require(`express`);
const cors = require("cors");
const routes = require("./routes");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
process.env.TZ = "America/Sao_Paulo";
process.env.CPIC_MAX_CONV = 20000;
const package = require("../package.json");
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: package.name,
      description: package.description,
      version: package.version,
      contact: {
        name: "Matheus Rodrigues",
        email: "Matheus.rdos@souunit.com.br",
      },
      servers: [
        {
          url: "http://localhost:3333",
          description: "Development server",
        },
        {
          url: "http://localhost:3333",
          description: "Test server",
        },
        {
          url: "http://localhost:3333",
          description: "Production server",
        },
      ],
    },
  },
  // ['.routes/*.js']
  apis: ["./src/routes.js"],
};
// initialize swaggerJSDoc

const swaggerDocs = swaggerJsDoc(swaggerOptions);
var swaggerSpec = swaggerDocs;

const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// route for swagger.json
app.get("/swagger.json", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});
let corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  preflightContinue: false,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(routes);
app.options("*", cors());
const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log("iniciado, ouvindo porta " + PORT + "...");
});
