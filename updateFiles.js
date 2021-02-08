const fs = require("fs");
const testFolder = "./public/audio/";

let files = fs.readdirSync(testFolder);

const newJSFile = `const songs = ${JSON.stringify(
  files
)}; export default songs;`;

fs.writeFileSync("./src/files.js", newJSFile);
