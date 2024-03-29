const inquirer = require("inquirer");
require("colors");

const preguntas = [
  {
    type: "list",
    name: "opcion",
    message: "Bienvenido a Clima-App. ¿Que deseas hacer?",
    choices: [
      { value: 1, name: `${"1.".green} Buscar ciudad` },
      { value: 2, name: `${"2.".green} Historial` },
      { value: 0, name: `${"0.".green} Salir` },
    ],
  },
];

const inquirerMenu = async () => {
  console.clear();
  console.log("==============================".green);
  console.log("    Seleccione una opción".white);
  console.log("==============================\n".green);

  const { opcion } = await inquirer.prompt(preguntas);

  return opcion;
};

const pausa = async () => {
  const question = [
    {
      type: "input",
      name: "enter",
      message: `Presione ${"enter".green} para continuar`,
    },
  ];
  console.log(`\n`);
  await inquirer.prompt(question);
};

const readInput = async (message) => {
  const question = [
    {
      type: "input",
      name: "desc",
      message,
      validate(value) {
        if (value.length === 0) {
          return "Por favor ingrese un valor";
        }
        return true;
      },
    },
  ];
  const { desc } = await inquirer.prompt(question);
  return desc;
};

const listarLugares = async (lugares = []) => {
  console.log();
  const choices = lugares.map((lugar, i) => {
    const index = `${i + 1}.`.green;
    return {
      value: lugar.id,
      name: `${index} ${lugar.nombre}`,
    };
  });

  choices.unshift({
    value: 0,
    name: "0.".green + " Cancelar",
  });

  const preguntas = [
    {
      type: "list",
      name: "id",
      message: "Seleccione lugar:",
      choices,
    },
  ];
  const { id } = await inquirer.prompt(preguntas);
  return id;
};

const confirmar = async (message) => {
  const question = [{ type: "confirm", name: "ok", message }];
  const { ok } = await inquirer.prompt(question);
  return ok;
};

const mostrarListadoChecklist = async (tareas = []) => {
  console.log();
  const choices = tareas.map((tarea, i) => {
    const index = `${i + 1}.`.green;
    return {
      value: tarea.id,
      name: `${index} ${tarea.desc}`,
      checked: tarea.completadoEn ? true : false,
    };
  });

  const pregunta = [
    {
      type: "checkbox",
      name: "ids",
      message: "Seleccione",
      choices,
    },
  ];
  const { ids } = await inquirer.prompt(pregunta);
  return ids;
};

module.exports = {
  inquirerMenu,
  pausa,
  readInput,
  listarLugares,
  confirmar,
  mostrarListadoChecklist,
};
