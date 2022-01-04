/*
const stdin = process.stdin.on("data", (msg) =>
  console.log("entrada terminal:", msg.toString())
);

const stdout = process.stdin.on("data", (msg) =>
  console.log("saída terminal:", msg.toString())
);

stdin.pipe(process.stdout); // replica o dado no terminal

*/

const http = require("http");
const { readFileSync, createReadStream } = require("fs");
const path = require("path");
// node -e "process.stdout.write(crypto.randomBytes(1e9))" > big.file # gerando um arquivo de quase 1GB

http
  .createServer((req, res) => {
    /**
     * Pensando no dia a dia:
     * - importo o readFile, leio o arquivo e passo pra frente
     *
     
      const file = readFileSync(path.join(__dirname, "big.file")).toString();
      res.write(file);
      res.end();

      // curl localhost:4433 
      // tirando o toString de file e rodando curl localhost:4433 --output output.txt, será gerado o buffer em um arquivo
      // NAO ABRIR O ARQUIVO
      
    // Error: Cannot create a string longer than 0x1fffffe8 characters
    */

    createReadStream(path.join(__dirname, "big.file")).pipe(res); // a medida que ler o arquivo, add no funil para o response (reatable stream)
  })
  .listen(4433, () => console.log("running on %s", 4433));
