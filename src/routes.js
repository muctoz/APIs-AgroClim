const { Router } = require("express");

const HealthCheck = require("./Controlers/healthCheckController");
const ScrapperController = require("./Controlers/WebScrapperController");

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

module.exports = routes;
