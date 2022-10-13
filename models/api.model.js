const fs = require("fs/promises");

exports.selectEndpoints = () => {
  return fs
    .readFile(`${__dirname}/../endpoints.json`, "UTF-8")
    .then((endpoints) => {
      return JSON.parse(endpoints);
    });
};

