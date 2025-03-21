# Etapa de compilación (con Rust)
FROM rust:1.81 AS builder

WORKDIR /usr/src/microservicio-rust

# Copiar los archivos del proyecto
COPY microservicio-rust/Cargo.toml .
COPY microservicio-rust/src ./src

# Compilar el proyecto en modo release
RUN cargo build --release


# Etapa final con Debian Bookworm
FROM debian:bookworm-slim

# Instalar las dependencias necesarias
RUN apt-get update && apt-get install -y libssl-dev ca-certificates && rm -rf /var/lib/apt/lists/*

# Copiar el binario compilado desde la etapa de compilación
COPY --from=builder /usr/src/microservicio-rust/target/release/microservicio-rust /usr/local/bin/microservicio-rust


# Exponer el puerto
EXPOSE 3000

# Ejecutar el binario
CMD ["microservicio-rust"]
