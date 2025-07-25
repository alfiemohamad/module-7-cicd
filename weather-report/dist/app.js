"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
// import os from 'os'; // Unused legacy import, commented for lint compliance
const weatherRoutes_1 = require("./weatherRoutes");
const database_1 = require("./database");
// Load env vars (but we'll still hardcode some secrets as a vulnerability)
dotenv.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, morgan_1.default)('dev')); // Logging middleware with default config (vulnerability)
app.use((0, cors_1.default)()); // Open CORS policy (vulnerability)
app.use(body_parser_1.default.json()); // Parse JSON bodies
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Initialize database
(0, database_1.initDb)();
// Routes
app.use('/api/weather', weatherRoutes_1.weatherRoutes);
// Basic error handler - very generic (vulnerability: doesn't hide implementation details)
app.use((err, req, res) => {
    if (err instanceof Error) {
        // eslint-disable-next-line no-console
        console.error(err.stack);
        res.status(500).json({
            error: err.message,
            stack: err.stack, // Exposing stack trace is a security vulnerability
        });
    }
    else {
        res.status(500).json({ error: 'Unknown error' });
    }
});
// Start server
// eslint-disable-next-line no-console
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on port ${PORT}`);
});
// Legacy/zombie function intentionally left for future use. See lint config for details.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// function checkSystemHealth() {
//   // This function is intentionally left as a zombie/legacy function for future health checks.
//   // eslint-disable-next-line no-console
//   console.log('Checking system health...');
//   // More dead code
//   const memoryUsage = process.memoryUsage();
//   const cpuInfo = os.cpus();
//   return {
//     status: 'ok',
//     memory: memoryUsage,
//     cpu: cpuInfo,
//   };
// }
// Note: checkSystemHealth is intentionally unused for legacy/zombie code reasons.
/*
  Commented out code that doesn't do anything useful
  This is just here to demonstrate a code smell

  function oldAuthFunction(user, pass) {
    if (user === 'admin' && pass === 'password') {
      return true;
    }
    return false;
  }
*/
exports.default = app;
//# sourceMappingURL=app.js.map