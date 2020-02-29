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
	fmt.Println(dbURI)

	conn, err := gorm.Open("mysql", dbURI)
	if err != nil {
		fmt.Print(err)
	}

	db = conn
}

func front(w http.ResponseWriter, req *http.Request) {
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

// Get path to static assets directory from env variable
var staticAssetsDir = os.Getenv("STATIC_ASSETS_DIR")

// neuteredFileSystem is used to prevent directory listing of static assets
type neuteredFileSystem struct {
	fs http.FileSystem
}

func (nfs neuteredFileSystem) Open(path string) (http.File, error) {
	// Check if path exists
	f, err := nfs.fs.Open(path)
	if err != nil {
		return nil, err
	}

	// If path exists, check if is a file or a directory.
	// If is a directory, stop here with an error saying that file
	// does not exist. So user will get a 404 error code for a file or directory
	// that does not exist, and for directories that exist.
	s, err := f.Stat()
	if err != nil {
		return nil, err
	}
	if s.IsDir() {
		return nil, os.ErrNotExist
	}

	// If file exists and the path is not a directory, let's return the file
	return f, nil
}

// func main() {
//     [...]
//     // Serve static files while preventing directory listing
//     mux := http.NewServeMux()
//     fs := http.FileServer(neuteredFileSystem{http.Dir(staticAssetsDir)})
//     mux.Handle("/", fs)
//     [...]
// }

// func main() {
// 	PORT := os.Getenv("PORT")

// 	// fs := http.FileServer(neuteredFileSystem{http.Dir(staticAssetsDir)})
// 	// http.Handle("/public/", http.StripPrefix("/public/", fs))

// 	http.HandleFunc("/", front)
// 	http.HandleFunc("/posts", posts)

// 	// mux := http.NewServeMux()
// 	// fs := http.FileServer(neuteredFileSystem{http.Dir(staticAssetsDir)})
// 	// mux.Handle("/", fs)

// 	log.Printf("Listening to port %v", PORT)
// 	http.ListenAndServe(":"+PORT, nil)
// }
