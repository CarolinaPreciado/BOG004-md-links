const mdLinks = require("./index.js");

const thirdPosition = (options) => {
  let option;
  if (process.argv[3] === "--validate" && process.argv[4] === "--stats") {
    option = { validate: true, stats: true };
  } else if (process.argv[3] === "--stats") {
    option = { stats: true };
  } else if (process.argv[3] === "--validate") {
    option = { validate: true };
  } else {
    option = {};
  }
  return option;
};

mdLinks(process.argv[2], thirdPosition(process))
  .then((res) => {
    console.log(res);
  })
  .catch((err) => err, "Esto es un error  de mdlink");
