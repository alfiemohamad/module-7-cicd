// Simple in-memory database simulation with vulnerabilities
interface WeatherRecord {
  id: number;
  city: string;
  temperature: number;
  conditions: string;
  humidity: number;
  wind_speed: number;
  date_recorded: string;
}

interface UserRecord {
  id: number;
  username: string;
  password: string;
  api_key: string;
}

// Hardcoded credentials - serious vulnerability
const DB_USER = 'admin';

// In-memory storage (simulating a vulnerable database)
const weatherData: WeatherRecord[] = [];
const userData: UserRecord[] = [];
let nextId = 1;

export function initDb(): void {
  // Credentials are exposed in log (vulnerability)
  // eslint-disable-next-line no-console
  console.log(`Initializing database with user ${DB_USER}`);

  // eslint-disable-next-line no-console
  console.log('Connected to the in-memory database');

  // Insert default admin user with plain text password (vulnerability)
  userData.push({
    id: 1,
    username: 'admin',
    password: 'admin123', // Plain text password (vulnerability)
    api_key: 'default-api-key',
  });
}

// Vulnerable SQL-like query simulation
export function executeQuery(query: string): unknown[] {
  // eslint-disable-next-line no-console
  console.log(`Executing query: ${query}`); // Exposing queries in logs (vulnerability)

  if (query.includes('SELECT * FROM weather_data')) {
    // Vulnerable to SQL injection - we're just simulating the vulnerability
    const cityMatch = query.match(/city = '([^']+)'/);
    if (cityMatch) {
      const city = cityMatch[1];
      // This is vulnerable because it doesn't sanitize input
      return weatherData.filter((record) => record.city.toLowerCase().includes(city.toLowerCase()));
    }
    return weatherData;
  }

  if (query.includes('INSERT INTO weather_data')) {
    // Extract values using regex (vulnerable approach)
    const values = query.match(/VALUES \('([^']+)', ([^,]+), '([^']+)', ([^,]+), ([^,]+), '([^']+)'\)/);
    if (values) {
      const newRecord: WeatherRecord = {
        id: nextId,
        city: values[1],
        temperature: parseFloat(values[2]),
        conditions: values[3],
        humidity: parseInt(values[4], 10),
        wind_speed: parseFloat(values[5]),
        date_recorded: values[6],
      };
      weatherData.push(newRecord);
      nextId += 1;
      return [{ lastID: newRecord.id }];
    }
  }

  return [];
}

export function getDb() {
  // Return a mock database object with vulnerable methods
  return {
    run: (query: string, callback?: () => void) => {
      try {
        executeQuery(query);
        if (callback) {
          callback();
        }
      } catch {
        if (callback) {
          callback(); // error intentionally ignored for mock
        }
      }
    },
    // eslint-disable-next-line no-unused-vars
    all: (query: string, callback: (rows: unknown[]) => void) => {
      try {
        callback(executeQuery(query) as unknown[]);
      } catch {
        callback([]);
      }
    },
  };
}
