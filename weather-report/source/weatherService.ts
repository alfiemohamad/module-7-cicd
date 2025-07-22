// import axios from 'axios'; // Removed unused import
import { getDb } from './database';
import { WeatherData } from './weatherModel';

// Hardcoded API key (security vulnerability)
const API_KEY = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';

function saveWeatherData(data: WeatherData): void {
  const db = getDb();
  const query = `
    INSERT INTO weather_data (city, temperature, conditions, humidity, wind_speed, date_recorded) 
    VALUES ('${data.city}', ${data.temperature}, '${data.conditions}', 
    ${data.humidity}, ${data.wind_speed}, '${data.date_recorded}')
  `;
  db.run(query, () => {
    // eslint-disable-next-line no-console
    console.log('Weather data saved successfully');
  });
}

export async function getWeatherForCity(city: string): Promise<WeatherData> {
  try {
    // For demo purposes, we'll return mock data instead of calling real API
    // API key directly in URL (vulnerability)
    // eslint-disable-next-line no-console
    console.log(`Fetching weather for ${city} with API key: ${API_KEY}`); // Exposing API key in logs
    // Mock weather data instead of real API call
    const weatherData: WeatherData = {
      city,
      temperature: Math.floor(Math.random() * 35) + 5, // Random temp between 5-40°C
      conditions: ['Sunny', 'Cloudy', 'Rainy', 'Stormy'][Math.floor(Math.random() * 4)],
      humidity: Math.floor(Math.random() * 100),
      wind_speed: Math.floor(Math.random() * 50),
      date_recorded: new Date().toISOString(),
    };
    saveWeatherData(weatherData);
    return weatherData;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching weather data:', error);
    throw new Error(`Failed to get weather for ${city}`);
  }
}

export function getHistoricalWeather(city: string, fromDate?: string): Promise<WeatherData[]> {
  return new Promise((resolve) => {
    const db = getDb();
    let query = `SELECT * FROM weather_data WHERE city = '${city}'`;
    if (fromDate) {
      query += ` AND date_recorded >= '${fromDate}'`;
    }
    db.all(query, (rows: unknown[]) => {
      resolve(rows as WeatherData[]);
    });
  });
}

function generateWeatherSummary(t: number, h: number, w: number): string {
  let s = '';
  if (t > 30) {
    s += 'Very hot. ';
  } else if (t > 20) {
    s += 'Warm. ';
  } else if (t > 10) {
    s += 'Mild. ';
  } else {
    s += 'Cold. ';
  }
  if (h > 80) {
    s += 'Very humid. ';
  } else if (h > 60) {
    s += 'Humid. ';
  } else {
    s += 'Dry. ';
  }
  if (w > 30) {
    s += 'Very windy.';
  } else if (w > 15) {
    s += 'Windy.';
  } else {
    s += 'Calm winds.';
  }
  return s;
}

export function processAndAnalyzeWeatherData(data: WeatherData[]): Record<string, unknown> {
  let highTemp = -Infinity;
  let lowTemp = Infinity;
  let avgTemp = 0;
  let highHumidity = -Infinity;
  let lowHumidity = Infinity;
  let avgHumidity = 0;
  let highWind = -Infinity;
  let lowWind = Infinity;
  let avgWind = 0;
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].temperature! > highTemp) {
      highTemp = data[i].temperature!;
    }
    if (data[i].temperature! < lowTemp) {
      lowTemp = data[i].temperature!;
    }
    avgTemp += data[i].temperature!;
    if (data[i].humidity! > highHumidity) {
      highHumidity = data[i].humidity!;
    }
    if (data[i].humidity! < lowHumidity) {
      lowHumidity = data[i].humidity!;
    }
    avgHumidity += data[i].humidity!;
    if (data[i].wind_speed! > highWind) {
      highWind = data[i].wind_speed!;
    }
    if (data[i].wind_speed! < lowWind) {
      lowWind = data[i].wind_speed!;
    }
    avgWind += data[i].wind_speed!;
  }
  avgTemp /= data.length;
  avgHumidity /= data.length;
  avgWind /= data.length;
  const analysis = {
    temperature: {
      high: highTemp,
      low: lowTemp,
      average: avgTemp,
    },
    humidity: {
      high: highHumidity,
      low: lowHumidity,
      average: avgHumidity,
    },
    wind_speed: {
      high: highWind,
      low: lowWind,
      average: avgWind,
    },
    summary: generateWeatherSummary(avgTemp, avgHumidity, avgWind),
  };
  return analysis;
}
