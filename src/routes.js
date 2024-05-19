const { Router } = require("express");

const HealthCheck = require("./Controlers/healthCheckController");
const ScrapperController = require("./Controlers/WebScrapperController");
const Wheather = require("./Controlers/wheatherController");

const routes = Router();

/**
 * @swagger
 * /api:
 *     responses:
 *       '200':
 *         description: sucess
 */
routes.get("/", HealthCheck.healthCheck);
routes.post("/WebScrapper", ScrapperController.WebScrapper);
routes.post("/Wheather", Wheather.Wheather);

module.exports = routes;
