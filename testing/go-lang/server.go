package main

import (
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"time"
)

type Response struct {
	Message string `json:"message"`
	Delay   string `json:"delay,omitempty"`
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	http.HandleFunc("/endpoint", func(w http.ResponseWriter, r *http.Request) {
		randomFailure := rand.Float64() < 0.3                      // 30% probability of failure
		delay := time.Duration(rand.Intn(3000)) * time.Millisecond // Random delay up to 3 seconds

		log.Println("Iniciando procesamiento para una solicitud Go ...")

		time.Sleep(delay)

		if randomFailure {
			log.Println("Go request failed. Responding with 500 error.")
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(Response{Message: "Internal Server Error in Go"})
		} else {
			log.Printf("Go request succeeded after a delay of %vms.\n", delay.Milliseconds())
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(Response{
				Message: "Successful Go request",
				Delay:   strconv.Itoa(int(delay.Milliseconds())) + "ms",
			})
		}
	})

	log.Printf("Go microservice running on port %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
