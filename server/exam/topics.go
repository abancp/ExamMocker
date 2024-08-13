package exam

import (
	"context"
	"fmt"
	"net/http"
	"server/config"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type TopicBody struct {
	Subject string `json:"subject"`
	Topic   string `json:"topic"`
}

type Topics struct {
	Type   string `json:"type"`
	Topics struct {
		Mathematics []string `json:"mathematics"`
		Physics     []string `json:"physics"`
		Chemistry   []string `json:"chemistry"`
	} `json:"topics"`
}

func AddTopic(c *gin.Context) {
	var body TopicBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	db := config.DB
	var topics Topics

	err := db.Collection("topics").FindOne(context.Background(), bson.M{"type": "topics"}).Decode(&topics)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			topics.Type = "topics"
			topics.Topics.Mathematics = []string{}
			topics.Topics.Physics = []string{}
			topics.Topics.Chemistry = []string{}
			_, err := db.Collection("topics").InsertOne(context.Background(), topics)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
				return
			}
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
			return
		}
	}
	nestedSubjectArray := "topics."+body.Subject
	result, err := db.Collection("topics").UpdateOne(context.Background(),
		bson.M{"type": "topics"},
		bson.M{"$addToSet": bson.M{nestedSubjectArray: body.Topic}})
	fmt.Print(result)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true})

}

func GetTopics(c *gin.Context) {
	db := config.DB
	var topic Topics
	err := db.Collection("topics").FindOne(context.Background(), bson.M{"type": "topics"}).Decode(&topic)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusOK, gin.H{"success":true,"topics": topic.Topics})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success":true,"topics": topic.Topics})
}
