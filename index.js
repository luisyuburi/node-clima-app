const {
  inquirerMenu,
  pausa,
  readInput,
  listarLugares,
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async () => {
  console.clear();
  const busquedas = new Busquedas();
  let opt;

  do {
    opt = await inquirerMenu();
    switch (opt) {
      case 1:
        // Mostrar mensaje
        const termino = await readInput("Ciudad: ");

        // Buscar los lugares
        const lugares = await busquedas.ciudad(termino);

        // Seleccionar el lugar
        const id = await listarLugares(lugares);
        if (id === 0) continue;

        // Guardar en DB
        const lugarSel = lugares.find((l) => l.id === id);

        busquedas.agregarHistorial(lugarSel.nombre);

        // Clima
        const clima = await busquedas.climaLugar(
          lugarSel.latitud,
          lugarSel.longitud
        );

        // Mostrar resultados
        console.log("\nInformacion de la ciudad\n".green.bold);
        console.log(`${"Ciudad:".bold} ${lugarSel.nombre}`);
        console.log(`${"Latitud:".bold} ${lugarSel.latitud}`);
        console.log(`${"Longitud:".bold} ${lugarSel.longitud}`);
        console.log(`${"Información del clima:".bold} ${clima.desc}`);
        console.log(`${"Temperatura:".bold} ${clima.temp} ºC`);
        console.log(`${"Temperatura Máxima:".bold} ${clima.max_temp} ºC`);
        console.log(`${"Temperatura Mínima:".bold} ${clima.min_temp} ºC`);

        break;
      case 2:
        busquedas.historialCapitalizado.forEach((lugar, i) => {
          const idx = `${i + 1}.`.green;
          console.log(`${idx} ${lugar}`);
        });
        break;
    }

    if (opt !== 0) await pausa();
  } while (opt !== 0);
};

main();
