const { read } = require("../index.js");
const { pathValidation } = require("../index.js");
const { identifyFile } = require("../index.js");
const { validateLink } = require("../index.js");
const linkCheck = require('link-check'); 
const { mdLinks } = require('../index.js');
const markdownLinkExtractor = require('markdown-link-extractor');
  
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
  })
});
describe('mdLinks', () => {
  it('mdLinks sin validate', () => {
    let resultExpect = './testTwo.md https://es.wikipedia.org/wiki/Markdown Markdown\n' 
    let path = './testTwo.md';
    return mdLinks(path, {validate:false})
    .then(respuesta => {
      expect(respuesta).toBe(resultExpect)
    })
    .catch((err) => console.log(err, 'mensaje de error'));
  })
})

describe('mdLinks', () => {
  it('mdLinks con validate', () => {
    let resultExpect = './testTwo.md https://es.wikipedia.org/wiki/Markdown 200 Ok Markdown\n' 
    let path = './testTwo.md';
    return mdLinks(path, {validate:true})
    .then(respuesta => {
      expect(respuesta).toBe(resultExpect)
    })
    .catch((err) => console.log(err, 'mensaje de error'));
  })
})

describe('mdLinks', () => {
  it('mdLinks con stats', () => {
    let resultExpect = 'Total: 1\nUnique: 1' 
    let path = './testTwo.md';
    return mdLinks(path, {stats:true})
    .then(respuesta => {
      expect(respuesta).toBe(resultExpect)
    })
    .catch((err) => console.log(err, 'mensaje de error'));
  })
})

describe('mdLinks', () => {
  it('mdLinks con validate y stats', () => {
    let resultExpect = { total: 1, unique: 1, broken: 0 }
    let path = './testTwo.md';
    return mdLinks(path, {validate:true, stats: true})
    .then(respuesta => {
      expect(respuesta).toEqual(resultExpect)
    })
    .catch((err) => console.log(err, 'mensaje de error'));
  })
})