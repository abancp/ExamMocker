package exam

import (
	"context"
	"net/http"
	"server/config"

	"github.com/gin-gonic/gin"
)

type QuestionBody struct {
	Type     string   `json:"type"`
	Question string   `json:"question"`
	Options  [4]string`json:"options"`
	Answer   string   `json:"answer"`
}

func GetQuestions(c *gin.Context) {
	exam := c.Param("exam")

	switch exam {
	case "jee":
		{

		}
	}
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
	c.JSON(http.StatusOK,gin.H{"message":"Question added successfully"})

}
