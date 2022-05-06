const { resolve } = require("path");
const path = require("path");
const fs = require("fs");
const mdLinkExtractor = require("markdown-link-extractor");
const linkCheck = require("link-check");
const { error } = require("console");

//Esta constante guarda la ruta que se ingrese por consola
const userPath = process.argv[2];

const pathValidation = (route) => {
  //newRoute convierte la ruta relativa en absoluta
  const newRoute = path.resolve(route).normalize();
  if (!path.isAbsolute(userPath)) {
    // console.log("La ruta se transformo en absoluta", newRoute);
    return newRoute;
  } else {
    // console.log("La ruta es absoluta", userPath);
    return userPath;
  }
};
//Identifica si el archivo es .md
const identifyFile = (userPath) => {
  const isMd = path.extname(pathValidation(userPath)) === ".md";
  return isMd;
};
//Función para leer el archivo
const readNewFile = (userPath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(userPath, "UTF-8", (error, file) => {
      if (error) {
        throw error;
      }
      if (!identifyFile(userPath)) {
        reject("No se puede leer el archivo");
      }
      resolve(file);
    });
  });
};

//Función para crear el objeto con los datos y cambiar alive a ok y dead a fail
const validationStatusLink = (infoLinksArray) => {
  return new Promise((resolve, reject) => {
    const infoLinks = infoLinksArray.href;
    linkCheck(infoLinks, (error, result) => {
      if (error) {
        console.log(error);
        return;
      }
      let statusLinks = "";
      if (result.status === "alive") {
        statusLinks = "ok";
      } else {
        statusLinks = "fail";
      }
      resolve({
        file: infoLinksArray.file,
        href: infoLinksArray.href,
        statusCode: result.statusCode,
        status: statusLinks,
        text: infoLinksArray.text,
      });
    });
  });
};
let statsReturn = {};
const linkStats = (arrayObject) => {
  const total = arrayObject.length;
  const sizeLinks = arrayObject.map((e) => e.href);
  const uniqueLinks = new Set(sizeLinks);
  const unique = [...uniqueLinks].length;
  statsReturn.total = total;
  statsReturn.unique = unique;
  return statsReturn;
};

// const optionsView = {};
let validate = "";
let stats = "";
const thirdPosition = () => {
  if (process.argv[3] === "--validate") {
    validate = true;
  } else if (process.argv[3] === "--stats") {
    stats = true;
  }
  console.log(validate, "SOY VALIDATE");
  console.log(stats, "SOY STATS");
};

const validateAndStats = () => {
  if (process.argv[4] === "--stats") {
    stats = true;
  }
  console.log(
    linkStats([
      {
        file: "./test.md",
        href: "https://es.wikipedia.org/wiki/Markdown",
        statusCode: 200,
        status: "Ok",
        text: "Markdown",
      },
      {
        file: "./test.md",
        href: "https://nodejs.org/",
        statusCode: 200,
        status: "Ok",
        text: "Node.js",
      },
      {
        file: "./test.md",
        href: "https://user-image.githubusercontent.com/110297/42118443-b7a5f1f0-7bc8-11e8-96ad-9cc5593715a6.jpg",
        statusCode: 500,
        status: "Fail",
        text: "md-links",
      },
      {
        file: "./test.md",
        href: "https://developers.google.com/v8/",
        statusCode: 200,
        status: "Ok",
        text: "motor de JavaScript V8 de Chrome",
      },
    ]),
    "soy info basica"
  );
};
validateAndStats();

// console.log(validate, isValidate);

// const stats = process.argv[4];
// const isStats = stats === '--stats' ? true : false;
// console.log(stats, isStats);

const mdLinks = (path, options) => {
  return new Promise((resolve, reject) => {
    //Ingresa path
    //Función para convertir la ruta en absoluta
    const routeAbsolute = pathValidation(userPath);
    //Función que evalua si la ruta es un archivo .md
    identifyFile(routeAbsolute);
    //Función que lee el archivo y crea el objeto
    const basicInfoLinks = [];
    readNewFile(routeAbsolute)
      .then((file) => {
        //Se crea una constante para usar la libreria markdownLinkExtractor, para extraer los links
        const { links } = mdLinkExtractor(file, (extended = true));
        const arrayLinks = links.map((link) => {
          let basicInfoLink = {};
          basicInfoLink.file = userPath;
          basicInfoLink.href = link.href;
          basicInfoLink.text = link.text;
          basicInfoLinks.push(basicInfoLink);
          return basicInfoLink;
        });
        return basicInfoLinks;
      })
      .then((res) => {
        if (validate !== true && stats !== true) {
          resolve(res);
        } else if (stats === true) {
          resolve(linkStats(res));
        } else {
          resolve(
            Promise.all(res.map((element) => validationStatusLink(element)))
          );
        }
      })
      .catch((error) => {
        console.log(error);
        reject("Hubo un problema con la ejecución de la función");
      });
  });
};
mdLinks(userPath, thirdPosition())
  .then((res) => {
    console.log(res, "Se resolvio la promesa");
  })
  .catch((error) => {
    console.log(error, "No se resolvio la promesa");
  });
