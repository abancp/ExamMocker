package exam

import (
	"context"
	"fmt"
	"net/http"
	"server/config"

	"github.com/gin-gonic/gin"
)

type AddExamBody struct {
	Name   string `json:"name"`
	Date   int64  `json:"date"`
	ExamId string `json:"examId"`
}

func AddExam(c *gin.Context) {

	var body AddExamBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db := config.DB

	result, err := db.Collection("exams").InsertOne(context.Background(), body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	fmt.Println(result)

	c.JSON(http.StatusOK,gin.H{"success":true,"message":"Exam added , questions can add separately"})
}
