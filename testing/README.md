# Pruebas de rendimiendo usando K6

Antes de continuar con las instrucciones siguientes, debe instalar K6 en su computador

## Pruebas con RUST

Ir al proyecto Ruts, compilar y ejecutar el contenedor Docker

```bash
cd rust
docker build -t microservicio-rust:local .
docker run -p 3100:3100 -e PORT=3100 microservicio-rust:local

k6 run k6_test.js
```

## Pruebas NodeJS

Ir al proyecto NodeJs, compilar y ejecutar el contenedor Docker

```bash
cd nodejs
docker build -t microservicio-nodejs:local .
docker run -p 3200:3200 -e PORT=3200 -e DEBUG=app:server microservicio-nodejs:local

k6 run k6_test.js
```

## Pruebas Go-Lang

Ir al proyecto go-lang, compilar y ejecutar el contenedor Docker

```bash
cd go-lang
docker build -t microservicio-go:local .
docker run -p 3300:3300 -e PORT=3300 -e DEBUG=app:server microservicio-go:local

k6 run k6_test.js
```

## Despliegue sobre K8s

Para desplegar en AWS

```bash
kubectl apply -f deploy.yaml -n test
kubectl get pods -n test

```



## Troubleshoting

Conectarse al contenedor y revisar el contenido de la imagen

```bash
 docker run -it --entrypoint /bin/sh microservicio-rust:local
```
