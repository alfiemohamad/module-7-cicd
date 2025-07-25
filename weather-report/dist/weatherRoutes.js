"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.weatherRoutes = void 0;
// Prefer default export on a file with single export
// eslint-disable-next-line import/prefer-default-export
const express_1 = __importDefault(require("express"));
const weatherController_1 = require("./weatherController");
// eslint-disable-next-line import/prefer-default-export
exports.weatherRoutes = express_1.default.Router();
// Basic routes without proper authentication or rate limiting (vulnerability)
exports.weatherRoutes.get('/current', weatherController_1.getWeather);
exports.weatherRoutes.get('/history/:city', weatherController_1.getCityHistory);
exports.weatherRoutes.get('/analysis/:city', weatherController_1.getWeatherAnalysis);
exports.weatherRoutes.post('/admin/login', weatherController_1.adminLogin);
// No authentication middleware for admin routes (vulnerability)
// Commented out code - zombie code
/*
weatherRoutes.get('/forecast', async (req, res) => {
  // This route was removed but the code was left behind
  try {
    const city = req.query.city;
    const days = req.query.days || 3;

    // Forecast logic here

    res.json({ message: 'Forecast feature coming soon' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
*/
// No input validation on this route (vulnerability)
exports.weatherRoutes.get('/search', (req, res) => {
    const query = req.query.q;
    // This should validate the query parameter but doesn't
    res.json({
        message: `Searching for ${query}`,
        results: [], // Empty results for now
    });
});
//# sourceMappingURL=weatherRoutes.js.map