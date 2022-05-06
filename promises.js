const { resolve } = require("path");
const path = require("path");
const fs = require("fs");
const mdLinkExtractor = require("markdown-link-extractor");
const linkCheck = require("link-check");

//Esta constante guarda la ruta que se ingrese por consola
const userPath = process.argv[2];

const pathValidation = (route) => {
  //newRoute convierte la ruta relativa en absoluta
  const newRoute = path.resolve(route).normalize();
  if (!path.isAbsolute(userPath)) {
    console.log("La ruta se transformo en absoluta", newRoute);
    return newRoute;
  } else {
    console.log("La ruta es absoluta", userPath);
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

// const basicInfoLinks = [];
// readNewFile(userPath).then((file) => {
//   const { links } = mdLinkExtractor(file, (extended = true));

//   links.forEach((link) => {
//     const basicInfoLink = {};
//     basicInfoLink.href = link.href;
//     basicInfoLink.text = link.text;
//     basicInfoLink.file = userPath;
//     basicInfoLinks.push(basicInfoLink);
//     // console.log(basicInfoLinks.file, basicInfoLinks.href, basicInfoLinks.text);
//     // console.log(basicInfoLinks);
//     // console.log('Soy el console de links', links);
//   });
//   console.log(basicInfoLinks);
//   // Necesito retornar basicInfoLinks

//   //   console.log(basicInfoLinks.file, basicInfoLinks.href, basicInfoLinks.text);
// });

// const buildBasicResponse = (basicInfo) => {
//   basicInfo.forEach((link) => {
//     console.log(link.file, link.href, link.text);
//     // COMO SE PUEDO RETORNAR RESPUESTA FINAL? PARA LIBRERIA Y PARA COMANDO
//   });
// };
// buildBasicResponse(basicInfoLinks);
// ("AQUI NECESITO METER COMO ARGUMENTO EL RETORNO DE READNEWFILE O SEA BASICINFOLINKS");
// // );
// // C:\Users\57318\Development\Laboratoria\BOG004-md-links\testFile.md

// //     links.forEach(link =>
// //         linkCheck(link, function (err, result) {
// //             if (err) {
// //                 console.error(err);
// //                 return;
// //             }
// //             console.log(JSON.stringify(result, null, 4));
// //             // console.log(result.statusCode);

// //         })
// // );
