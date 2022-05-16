const { resolve } = require("path");
const path = require("path");
const fs = require("fs");
const mdLinkExtractor = require("markdown-link-extractor");
const linkCheck = require("link-check");
const { error } = require("console");

//Esta constante guarda la ruta que se ingrese por consola
const userPath = process.argv[2];

const pathValidation = (route) => {
  //PathAbsolute convierte la ruta relativa en absoluta
  const pathAbsolute = path.resolve(route).normalize();
  if (!path.isAbsolute(userPath)) {
    // console.log("La ruta se transformo en absoluta", pathAbsolute);
    return pathAbsolute;
  } else {
    // console.log("La ruta es absoluta", userPath);
    return userPath;
  }
};
// identifyFile Identifica si el archivo que se esta leyendo es .md
const identifyFile = (userPath) => {
  const isMd = path.extname(pathValidation(userPath)) === ".md";
  return isMd;
};

//Función para leer el archivo
const read = (userPath) => {
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

// Función que permite validar el estado del link y retorna un objeto con href, text, file, status y statusCode
const validateLink = (infoLinkObject) => {
  return new Promise((resolve, reject) => {
    const infoLink = infoLinkObject.href;

    linkCheck(infoLink, (error, result) => {
      if (error) {
        console.log(error);
        reject("No se pueden leer las propiedades del link");
        return;
      }
      let statusLinks = "";
      if (result.status === "alive") {
        statusLinks = "Ok";
      } else {
        statusLinks = "Fail";
      }
      resolve({
        file: infoLinkObject.file,
        href: infoLinkObject.href,
        statusCode: result.statusCode,
        status: statusLinks,
        text: infoLinkObject.text,
      });
    });
  });
}; 

const linkStats = (arrayObject) => {
  const total = arrayObject.length;
  const sizeLinks = arrayObject.map((e) => e.href);
  const uniqueLinks = new Set(sizeLinks);
  const unique = [...uniqueLinks].length;

  return { total, unique };
};
const validateAndStats = (arrayObject, totalUnique) => {
  let broken = arrayObject.filter((e) => e.status === "Fail").length;
  // Los ... indican que pasa de {total: 82, unique: 77} a total: 82, unique: 77 -- Elimina el objeto y deja solo las propiedades
  return { ...totalUnique, broken: broken };
};

const mdLinks = (userPath, options) => {
  return new Promise((resolve, reject) => {
    //Ingresa path
    //Función para convertir la ruta en absoluta
    const pathAbsolute = pathValidation(userPath);
    //Función que evalua si la ruta es un archivo .md
    identifyFile(pathAbsolute);
    //Función que lee el archivo y crea el objeto
    const basicInfoLinks = [];
    read(pathAbsolute)
      .then((file) => {
        //Se crea una constante para usar la libreria markdownLinkExtractor, para extraer los links
        const { links } = mdLinkExtractor(file, (extended = true));
        const arrayLinks = links.map((link) => {
          let objetResolve = {};
          objetResolve.file = userPath;
          objetResolve.href = link.href;
          objetResolve.text = link.text;
          basicInfoLinks.push(objetResolve);
          return objetResolve;
        });
        return basicInfoLinks;
      })
      .then((res) => {
        if (options.validate !== true && options.stats !== true) {
          return res;
        } else if (options.validate === true && options.stats === true) {
          return Promise.all(res.map((element) => validateLink(element)));
        } else if (options.stats === true) {
          return linkStats(res);
        } else {
          return Promise.all(res.map((e) => validateLink(e)));
        }
      })
      .then((res) => {
        if (options.validate !== true && options.stats !== true) {
          resolve(res.map((e) => `${e.file} ${e.href} ${e.text}\n`).join(""));
        } else if (options.validate === true && options.stats === true) {
          resolve(validateAndStats(res, linkStats(res)));
        } else if (options.stats === true) {
          resolve(`Total: ${res.total}\nUnique: ${res.unique}`);
        } else {
          resolve(
            res
              .map(
                (e) =>
                  `${e.file} ${e.href} ${e.statusCode} ${e.status} ${e.text}\n`
              )
              .join("")
          );
        }
      })
      .catch((error) => {
        console.log(error);
        reject("Hubo un problema con la ejecución de la función");
      });
  });
};
module.exports = { pathValidation, read, validateLink, mdLinks };
