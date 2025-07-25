import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import * as dotenv from 'dotenv';
// import os from 'os'; // Unused legacy import, commented for lint compliance
import { weatherRoutes } from './weatherRoutes';
import { initDb } from './database';

// Load env vars (but we'll still hardcode some secrets as a vulnerability)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev')); // Logging middleware with default config (vulnerability)
app.use(cors()); // Open CORS policy (vulnerability)
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize database
initDb();

// Routes
app.use('/api/weather', weatherRoutes);

// Basic error handler - very generic (vulnerability: doesn't hide implementation details)
app.use((err: unknown, req: express.Request, res: express.Response) => {
  if (err instanceof Error) {
    // eslint-disable-next-line no-console
    console.error(err.stack);
    res.status(500).json({
      error: err.message,
      stack: err.stack, // Exposing stack trace is a security vulnerability
    });
  } else {
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

function unusedFunction() {
  // This function is never used (code smell)
  return 42;
}

export default app;
