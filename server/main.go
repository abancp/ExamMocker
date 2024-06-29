package main

import (
	"server/auth"
	"server/config"

	"github.com/gin-gonic/gin"
)

func main() {

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

	// Start the server on port 8080
	r.Run(":8080")
}
