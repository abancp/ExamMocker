package main

import (
	"log"
	"server/auth"
	"server/config"
	"server/exam"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {

	// Load the .env file
    err := godotenv.Load()
    if err != nil {
        log.Fatalf("Error loading .env file: %v", err)
    }
	
	//connect to mongodb
	config.ConnectDb()

	// Initialize a Gin router
	r := gin.Default()

	//routes
	r.GET("/hello", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Hello, World!",
		})
	})

	auth.Auth(r)
	exam.Exam(r)

	// Start the server on port 8080
	r.Run(":8080")
}
