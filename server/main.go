package main

import (
	"log"
	"server/auth"
	"server/config"
	"server/exam"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)


func main() {

	err := godotenv.Load()

	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	config.ConnectDb()

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"https://exam-mocker.vercel.app", "http://localhost:3000","https://31ff-2409-4073-201f-abdd-26ac-3c87-9add-efb0.ngrok-free.app"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	auth.Auth(r)
	exam.Exam(r)

	// Start the server on port 8080
	r.Run(":8080")
}
