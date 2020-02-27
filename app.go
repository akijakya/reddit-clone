package main

import (
	"log"
	"net/http"
)

func static(w http.ResponseWriter, r *http.Request) {
	// filename := r.URL.Path[1:]
	// if filename == "" {
	// 	filename = "reddit-front.html"
	// } else if filename[:6] != "flotr/" {
	// 	http.NotFound(w, r)
	// 	return
	// }
	// http.ServeFile(w, r, "public/views/"+filename)
	http.ServeFile(w, r, "public/views/reddit-front.html")
}

func posts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	switch r.Method {
	case "GET":
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message": "get called"}`))
	case "POST":
		w.WriteHeader(http.StatusCreated)
		w.Write([]byte(`{"message": "post called"}`))
	case "PUT":
		w.WriteHeader(http.StatusAccepted)
		w.Write([]byte(`{"message": "put called"}`))
	case "DELETE":
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message": "delete called"}`))
	default:
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte(`{"message": "not found"}`))
	}
}

func main() {
	PORT := 3000

	fs := http.FileServer(http.Dir("public"))
	http.Handle("/public/", http.StripPrefix("/public/", fs))
	http.HandleFunc("/", static)

	log.Println("Listening to port", PORT)
	http.ListenAndServe(":3000", nil)
}
