const fs = require("fs");
require("dotenv").config();
const axios = require("axios").default;

class Busquedas {
  historial = [];

  dbPath = "./db/database.json";

  constructor() {
    // ToDo: Leer DB si existe
    this.leerDB();
  }

  get historialCapitalizado() {
    // Capitalizar cada palabra
    return this.historial.map((lugar) => {
      let palabras = lugar.split(" ");
      palabras = palabras.map((p) => p[0].toUpperCase() + p.substring(1));
      return palabras.join(" ");
    });
  }

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: "es",
    };
  }

  get paramsOpenW() {
    return {
      units: "metric",
      appid: process.env.OPENWEATHER_KEY,
      lang: "es",
    };
  }

  async ciudad(lugar = "") {
    try {
      // peticion http
      const instanceMapbox = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.paramsMapbox,
      });
      const response = await instanceMapbox.get();
      const data = response.data.features;
      return data.map((lugar) => {
        return {
          id: lugar.id,
          nombre: lugar.place_name,
          longitud: lugar.center[0],
          latitud: lugar.center[1],
        };
      });
    } catch (error) {}
    return []; // Retornar los lugares
  }

  async climaLugar(lat, lon) {
    try {
      const instanceOpenW = axios.create({
        baseURL: "https://api.openweathermap.org/data/2.5/weather",
        params: { ...this.paramsOpenW, lat, lon },
      });

      const response = await instanceOpenW.get();
      const { weather, main } = response.data;
      return {
        desc: weather[0].description,
        temp: main.temp,
        min_temp: main.temp_min,
        max_temp: main.temp_max,
      };
    } catch (error) {
      console.error(error);
    }
  }

  agregarHistorial(lugar = "") {
    if (this.historial.includes(lugar.toLocaleLowerCase())) {
      return;
    }
    this.historial = this.historial.splice(0, 5);

    this.historial.unshift(lugar.toLocaleLowerCase());

    // Guardar en DB
    this.guardarDB();
  }

  guardarDB() {
    const payload = {
      historial: this.historial,
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  leerDB() {
    if (!fs.existsSync(this.dbPath)) return;
    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    const data = JSON.parse(info);
    this.historial = data.historial;
    return this.historial;
  }
}

module.exports = Busquedas;
