package exam

import (
	"context"
	"fmt"
	"net/http"
	"server/config"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type RegisterData struct {
	Email string `json:"email"`
}

func Register(c *gin.Context) {
	var body RegisterData
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	exam := c.Param("exam")
	id := c.Param("id")
	_id, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	db := config.DB
	switch exam {
	case "jee":
		{

			filter := bson.M{"$or": []bson.M{
				{"email": body.Email,"exam":_id},
			}}

			count, err := db.Collection("jee-users").CountDocuments(context.Background(), filter)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
				return
			}

			if count > 0 {
				c.JSON(http.StatusBadRequest, gin.H{"error": "User already registered for jee exam"})
				return
			}
			var registerData RegisterData
			registerData.Email = body.Email
			result, err := db.Collection("jee-users").InsertOne(context.Background(), registerData)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
				return
			}
			fmt.Println(result)
			c.JSON(http.StatusOK, gin.H{"success": true, "message": "registered for jee"})
		}
	default:
		{
			c.JSON(http.StatusInternalServerError,gin.H{"error":"Invalid exam"})
		}
	}
}
