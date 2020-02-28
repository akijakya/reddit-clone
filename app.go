package main

import (
	"log"
	"net/http"
	"strconv"
)

func static(w http.ResponseWriter, req *http.Request) {
	if req.Method == "GET" {
		log.Printf("Serving up path %s", req.URL.Path)
		if req.URL.Path == "/" {
			log.Printf("...redirecting to the front page")
			// serving our front page html
			http.ServeFile(w, req, "public/views/reddit-front.html")
		} else {
			// this part is necessary for serving the css, js etc. for the html
			http.ServeFile(w, req, "public/"+req.URL.Path)
		}
	} else {
		w.WriteHeader(400)
	}
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

	// fs := http.FileServer(http.Dir("public"))
	// http.Handle("/public/", http.StripPrefix("/public/", fs))

	http.HandleFunc("/", static)
	http.HandleFunc("/posts", posts)

	log.Printf("Listening to port %v", PORT)
	http.ListenAndServe(":"+strconv.Itoa(PORT), nil)
}
