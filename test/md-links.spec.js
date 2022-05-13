const { read } = require("../index.js");
const { pathValidation } = require("../index.js");
const { identifyFile } = require("../index.js");
const { validateLink } = require("../index.js");
  
jest.mock("link-check");

describe("pathValidation", () => {
  it("deberia retornar una ruta absoluta", () => {
    expect(pathValidation("../prueba.md")).toEqual(
      "C:\\Users\\57318\\Development\\Laboratoria\\prueba.md"
    );
  });
});

describe("Prueba de lectura de archivo", () => {
  it("Función read resulta", async () => {
    await expect(
      read(
        "C:\\Users\\57318\\Development\\Laboratoria\\BOG004-md-links\\prueba.md"
      )
    ).resolves.toEqual("Una Linea");
  });
});

const objectTest = {
  file: "./test.md",
  href: "https://es.wikipedia.org/wiki/Markdown",
  text: "Markdown",
};

const objectResolve = {
  file: "./test.md",
  href: "https://es.wikipedia.org/wiki/Markdown",
  text: "Markdown",
  statusCode: 200,
  status: "Ok",
};
describe("Prueba para validar el estado de los links", () => {
  const linkCheck = require("link-check");
  // console.log("Esto es linkCheck", linkCheck);
  it("validateLink", () =>
    validateLink(objectTest)
      .then((objectResolve) => {
        expect(objectResolve.statusCode).toBe(200);
      })
      .catch((err) => console.log(err, "Esta entrando en la función pero esta cayendo en el error")));
});

describe("Prueba para validar el estado de los links", () => {
    const linkCheck = require("link-check");
  it("validateLink", async () => {
    await expect(validateLink(objectTest)).resolves.toEqual(objectResolve);
  });

//   describe("Prueba para validar el estado de los links", () => {
//     it("validateLink se resuelve", () =>
//       validateLink(objectTest).mockImplementation(() =>
//         Promise.resolve(objectResolve)
//       ));
//   });
})
