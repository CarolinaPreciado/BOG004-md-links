#!/usr/bin/env node

const { mdLinks } = require("./index.js");

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

mdLinks(path = process.argv[2], thirdPosition(process))
  .then((res) => {
    console.log(res);
    return res;
  })
  .catch((err) => console.log(err, "Esto es un error  de mdlink"));

  module.exports = { mdLinks, thirdPosition };