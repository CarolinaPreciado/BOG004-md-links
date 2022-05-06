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

const identifyFile = (userPath) => {
  const isMd = path.extname(pathValidation(userPath)) === ".md";
  return isMd;
};
const readNewFile = (userPath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(userPath, "UTF-8", (error, file) => {
      if (error) {
        throw error;
      }
      if (!identifyFile(userPath)) {
        reject(error);
      }
      resolve(file);
    });
  });
};
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
      console.log(infoLinksArray, "Esto es info links array");
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
// const mdLinks = (path, options) => {
//   return new Promise((resolve, reject) => {
//     const routeAbsolute = pathValidation(userPath);
//     identifyFile(routeAbsolute);
//     const basicInfoLinks = [];
//     readNewFile(routeAbsolute)
//       .then((file) => {
//         const { links } = mdLinkExtractor(file, (extended = true));
//         const arrayLinks = links.map((link) => {
//           let basicInfoLink = {};
//           basicInfoLink.file = userPath;
//           basicInfoLink.href = link.href;
//           basicInfoLink.text = link.text;
//           basicInfoLinks.push(basicInfoLink);
//           return basicInfoLink;
//         });
//         return basicInfoLinks;
//       })
//       .then((res) => {
//         if (!options) {
//           resolve(res);
//         } else {
//           resolve(
//             Promise.all(res.map((element) => validationStatusLink(element)))
//           );
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//         reject("Hubo un problema con la ejecución de la función");
//       });
//   });
// };
// mdLinks(userPath)
//   .then((res) => {
//     console.log(res, "Se resolvio la promesa");
//   })
//   .catch((error) => {
//     console.log(error, "No se resolvio la promesa");
//   });
