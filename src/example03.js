const { pipeline, Readable, Writable, Transform } = require("stream");
const { promisify } = require("util");
const { createWriteStream } = require("fs");

const pipelineAsync = promisify(pipeline); // pra conseguir dar o await, já q o pipeline trabalha com callback

{
  const readableStream = new Readable({
    read: function () {
      // usando function e não arrow, pra conseguir usar o this
      this.push("Hello Dude!! 0");
      this.push("Hello Dude!! 1");
      this.push("Hello Dude!! 2");
      this.push(null);
    },
  });

  const writeableStream = new Writable({
    write(chunk, enconding, cb) {
      console.log("msg", chunk.toString());
      cb();
    },
  });

  (async () => {
    await pipelineAsync(readableStream, /*process.stdout,*/ writeableStream);
  })();

  console.log("------- processo 01 encerrado");
}

{
  const readableStream = new Readable({
    read() {
      for (let index = 0; index < 1e5; index++) {
        // 1e5 -> 1 seguido de 5 zeros
        const person = { id: Date.now() + index, name: `Miro-${index}` };

        // por padrão, as readable streams, usam buffer

        const data = JSON.stringify(person);

        this.push(data);
      }
      // avisa que acabou
      this.push(null);
    },
  });

  const writebleMapToCSV = new Transform({
    transform(chunk, enconding, cb) {
      const data = JSON.parse(chunk);
      const result = `${data.id}, ${data.name.toUpperCase()}\n`;

      cb(null, result);
    },
  });

  const setHeader = new Transform({
    transform(chunk, enconding, cb) {
      this.counter = this.counter ?? 0; // se não tiver nada, fica zero
      if (this.counter) {
        return cb(null, chunk);
      }
      this.counter += 1;
      cb(null, "id,name\n".concat(chunk));
    },
  });

  (async () => {
    await pipelineAsync(
      readableStream,
      writebleMapToCSV,
      setHeader,
      // process.stdout
      createWriteStream("my.csv") // na medida q os dados vão sendo consumidos, serão salvos em my.csv
    );
  })();

  // time node src/example03.js -> roda contando o tempo

  console.log("------- processo 02 encerrado");
}
