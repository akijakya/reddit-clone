package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/joho/godotenv"
)

var db *gorm.DB //database

func init() {
	// loads values from .env into the system
	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found")
	}

	username := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASS")
	dbName := os.Getenv("DB_NAME")
	dbHost := os.Getenv("DB_HOST")

	// string example to connect to a mysql database:
	// user:password@(localhost)/dbname?charset=utf8&parseTime=True&loc=Local
	dbURI := fmt.Sprintf("%s:%s@(%s)/%s?charset=utf8&parseTime=True&loc=Local", username, password, dbHost, dbName) //Build connection string

	conn, err := gorm.Open("mysql", dbURI)
	if err != nil {
		fmt.Print(err)
	} else {
		fmt.Println("Connection to database established")
	}

	db = conn
}

func front(w http.ResponseWriter, req *http.Request) {
	// Get path to static assets directory from env variable
	var staticAssetsDir string = os.Getenv("STATIC_ASSETS_DIR")
	if req.Method == "GET" {
		log.Printf("Serving up path %s", req.URL.Path)
		if req.URL.Path == "/" {
			log.Printf("...redirecting to the front page")
			// serving our front page html
			frontPage := staticAssetsDir + "/views/reddit-front.html"
			http.ServeFile(w, req, frontPage)
		} else {
			// this part is necessary for serving the css, js etc. for the html
			fi, err := os.Stat(staticAssetsDir + req.URL.Path)
			if err != nil {
				fmt.Println(err)
				return
			}
			if !fi.IsDir() {
				http.ServeFile(w, req, staticAssetsDir+req.URL.Path)
			} else {
				w.WriteHeader(403)
				// w.Write([]byte(`Nothing to see here`))
			}
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
	// Get port number from env variable
	PORT := os.Getenv("PORT")

	http.HandleFunc("/", front)
	http.HandleFunc("/posts", posts)

	log.Printf("Listening to port %v", PORT)
	http.ListenAndServe(":"+PORT, nil)
}
