import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 50 },  // Aumentar a 50 usuarios en 1 minuto
    { duration: '2m', target: 50 },  // Mantener 50 usuarios por 2 minutos
    { duration: '30s', target: 0 },  // Reducir gradualmente a 0 usuarios
  ],
};

export default function () {
  let res = http.get('http://localhost:3200/endpoint'); // Cambia a la IP de tu LoadBalancer

  check(res, {
    'status es 200': (r) => r.status === 200,
    'tiempo de respuesta < 2000ms': (r) => r.timings.duration < 2000,
    'error 500 simulado': (r) => r.status === 500 || r.status === 200,  // Acepta 500 como simulado
  });
  sleep(1); // Esperar 1 segundo entre cada solicitud
}
