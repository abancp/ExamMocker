package exam

import (
	"context"
	"fmt"
	"net/http"
	"server/config"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type ExamBody struct {
	Exam   string `json:"exam"`
	Date   int64  `json:"date"`
	ExamId string `json:"examId"`
}

func AddExam(c *gin.Context) {

	var body ExamBody
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

func GetExams(c *gin.Context) {
	db := config.DB
	givenId := c.Param("id")
	var exam ExamBody
	_id, err := primitive.ObjectIDFromHex(givenId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	err = db.Collection("exams").FindOne(context.Background(), bson.M{"_id": _id}).Decode(&exam)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Exams not Found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "exam": exam})
}