const files = require.context(
  ".", // current directory
  true, // subdirectories
  /.+\.json$/ // only .json
);
const messages: any = {};
files.keys().forEach((fileName: string) => {
  messages[fileName.replace(".json", "").replace("./", "")] = files(fileName);
});
export default messages;
