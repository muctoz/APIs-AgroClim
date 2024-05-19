const { execFile } = require("child_process");

const WebScrapper = (req, res) => {
  console.log("antes de ir");
  execFile("./src/WebScrapper/webscrapping.py", (error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    // Aqui você pode enviar uma resposta para o cliente ou realizar outras ações necessárias
  });
};

module.exports = { WebScrapper };
