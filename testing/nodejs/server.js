const express = require('express');
const debug = require('debug')('app:server'); // Importar debug y definir un espacio de nombres
const app = express();

app.get('/endpoint', (req, res) => {
  const randomFailure = Math.random() < 0.3; // 30% probabilidad de fallar
  const delay = Math.random() * 3000; // Retrasos de hasta 3 segundos

  debug(`Iniciando procesamiento para una solicitud nodeJS ...`);

  setTimeout(() => {
    if (randomFailure) {
      debug(`Falló la solicitud NodeJS. Respondemos con error 500.`);
      res.status(500).json({ message: 'Error interno del servidor NodeJS' });
    } else {
      debug(`Solicitud NodeJS exitosa después de un retraso de ${delay}ms.`);
      res.status(200).json({ message: 'Solicitud exitosa NodeJS', delay: `${delay}ms` });
    }
  }, delay);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  debug(`Microservicio NodeJS corriendo en el puerto ${port}`);
});
