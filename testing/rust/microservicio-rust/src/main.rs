use actix_web::{get, App, HttpResponse, HttpServer, Responder};
use rand::Rng;
use std::time::Duration;
use tokio::time::sleep;
use std::env;

#[get("/endpoint")]
async fn handle_request() -> impl Responder {
    let mut rng = rand::thread_rng();
    
    // 30% de probabilidad de fallar
    let failure_probability: f64 = rng.gen();
    let random_failure = failure_probability < 0.3;

    // Retrasos de hasta 3 segundos
    let delay_ms = rng.gen_range(0..3000);
    sleep(Duration::from_millis(delay_ms)).await;

    if random_failure {
        println!("Falló la solicitud Rust. Respondemos con error 500.");
        HttpResponse::InternalServerError().json("Error interno del servidor Rust")
    } else {
        println!("Solicitud Rust exitosa después de un retraso de {} ms.", delay_ms);
        HttpResponse::Ok().json(format!("Solicitud Rust exitosa después de {} ms.", delay_ms))
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Get port from environment variable or use 3000 as default
    let port = env::var("PORT")
        .ok()
        .and_then(|p| p.parse::<u16>().ok())
        .unwrap_or(3000);

    println!("Starting server on port {}", port);

    HttpServer::new(|| {
        App::new()
            .service(handle_request)
    })
    .bind(("0.0.0.0", port))?
    .run()
    .await
}
