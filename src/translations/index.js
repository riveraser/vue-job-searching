const files = require.context(
  ".", // current directory
  true, // subdirectories
  /.+\.json$/ // only .json
);
const messages = {};
files.keys().forEach((fileName) => {
  messages[fileName.replace(".json", "").replace("./", "")] = files(fileName);
});
export default messages;
