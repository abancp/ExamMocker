package exam

import (
	"context"
	"net/http"
	"server/config"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type QuestionBody struct {
	Type     string    `json:"type"`
	Question string    `json:"question"`
	Options  [4]string `json:"options"`
	Answer   string    `json:"answer"`
}

func GetQuestions(c *gin.Context) {
	db := config.DB
	var results []bson.M
	cursor, err := db.Collection("questions").Find(context.Background(), bson.D{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database Error"})
		return
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var result bson.M
		err := cursor.Decode(&result)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		results = append(results, result)
	}
	if err := cursor.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	print(results)
	c.JSON(http.StatusOK, gin.H{"questions": results})
}

func AddQuestion(c *gin.Context) {

	var questionBody QuestionBody
	if err := c.ShouldBindJSON(&questionBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB
	_, err := db.Collection("questions").InsertOne(context.Background(), questionBody)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Question added successfully"})

}

func GetQuestion(c *gin.Context) {
	db := config.DB
	givenId := c.Param("id")
	var question QuestionBody
	_id, err := primitive.ObjectIDFromHex(givenId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	err = db.Collection("questions").FindOne(context.Background(), bson.M{"_id": _id}).Decode(&question)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Question not Found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK,gin.H{"question":question})
}
