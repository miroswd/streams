const { writeFile } = require("fs");
const path = require("path");

const data = [];

for (let i = 0; i < 1e5; i++) {
  data.push({ id: Date.now() + i, name: `Miro-${i}` });
}

writeFile(path.join(__dirname, "fs.csv"), JSON.stringify(data), (err) => {
  if (err) console.log(err);
});
