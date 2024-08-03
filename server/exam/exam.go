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
	Exam      string `json:"exam"`
	Date      string `json:"date"`
	Questions struct {
		Mathematics []string `json:"mathematics"`
		Physics     []string `json:"physics"`
		Chemistry   []string `json:"chemistry"`
	} `json:"questions"`
	TotalQuestions int `json:"totalQuestions"`
}

type RegisterExamBody struct {
	Email string `json:"email"`
}

func AddExam(c *gin.Context) {

	var body ExamBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	body.Questions.Mathematics = make([]string, 30)
	body.Questions.Physics = make([]string, 30)
	body.Questions.Chemistry = make([]string, 30)

	db := config.DB

	result, err := db.Collection("exams").InsertOne(context.Background(), body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	fmt.Println(result)

	c.JSON(http.StatusOK, gin.H{"success": true, "id": result.InsertedID, "message": "Exam added , questions can add separately"})
}

func GetExam(c *gin.Context) {
	db := config.DB
	givenId := c.Param("id")
	_id, err := primitive.ObjectIDFromHex(givenId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	pipeline := mongo.Pipeline{
		// Match the document by _id
		bson.D{{Key: "$match", Value: bson.D{{Key: "_id", Value: _id}}}},

		// Project required fields
		bson.D{{Key: "$project", Value: bson.D{
			{Key: "exam", Value: 1},
			{Key: "date", Value: 1},
			{Key: "totalQuestions", Value: 1},
			{Key: "mathematics", Value: bson.D{{Key: "$ifNull", Value: bson.A{"$questions.mathematics", bson.A{}}}}},
			{Key: "physics", Value: bson.D{{Key: "$ifNull", Value: bson.A{"$questions.physics", bson.A{}}}}},
			{Key: "chemistry", Value: bson.D{{Key: "$ifNull", Value: bson.A{"$questions.chemistry", bson.A{}}}}},
		}}},

		// Replace empty strings with null in the mathematics array
		bson.D{{Key: "$addFields", Value: bson.D{
			{Key: "mathematics", Value: bson.D{
				{Key: "$map", Value: bson.D{
					{Key: "input", Value: "$mathematics"},
					{Key: "as", Value: "item"},
					{Key: "in", Value: bson.D{
						{Key: "$cond", Value: bson.A{
							bson.D{{Key: "$ne", Value: bson.A{"$$item", ""}}},
							"$$item",
							nil,
						}},
					}},
				}},
			}},
		}}},

		// Replace empty strings with null in the physics array
		bson.D{{Key: "$addFields", Value: bson.D{
			{Key: "physics", Value: bson.D{
				{Key: "$map", Value: bson.D{
					{Key: "input", Value: "$physics"},
					{Key: "as", Value: "item"},
					{Key: "in", Value: bson.D{
						{Key: "$cond", Value: bson.A{
							bson.D{{Key: "$ne", Value: bson.A{"$$item", ""}}},
							"$$item",
							nil,
						}},
					}},
				}},
			}},
		}}},

		// Replace empty strings with null in the chemistry array
		bson.D{{Key: "$addFields", Value: bson.D{
			{Key: "chemistry", Value: bson.D{
				{Key: "$map", Value: bson.D{
					{Key: "input", Value: "$chemistry"},
					{Key: "as", Value: "item"},
					{Key: "in", Value: bson.D{
						{Key: "$cond", Value: bson.A{
							bson.D{{Key: "$ne", Value: bson.A{"$$item", ""}}},
							"$$item",
							nil,
						}},
					}},
				}},
			}},
		}}},

		// Unwind and lookup for mathematics
		bson.D{{Key: "$unwind", Value: bson.D{{Key: "path", Value: "$mathematics"}, {Key: "preserveNullAndEmptyArrays", Value: true}}}},
		bson.D{{Key: "$addFields", Value: bson.D{
			{Key: "mathObjectID", Value: bson.D{{Key: "$toObjectId", Value: "$mathematics"}}},
		}}},
		bson.D{{Key: "$lookup", Value: bson.D{
			{Key: "from", Value: "questions"},
			{Key: "localField", Value: "mathObjectID"},
			{Key: "foreignField", Value: "_id"},
			{Key: "as", Value: "mathDocs"},
		}}},
		bson.D{{Key: "$unwind", Value: bson.D{{Key: "path", Value: "$mathDocs"}, {Key: "preserveNullAndEmptyArrays", Value: true}}}},
		bson.D{{Key: "$group", Value: bson.D{
			{Key: "_id", Value: "$_id"},
			{Key: "exam", Value: bson.D{{Key: "$first", Value: "$exam"}}},
			{Key: "date", Value: bson.D{{Key: "$first", Value: "$date"}}},
			{Key: "totalQuestions", Value: bson.D{{Key: "$first", Value: "$totalQuestions"}}},
			{Key: "mathematics", Value: bson.D{{Key: "$push", Value: bson.D{{Key: "$ifNull", Value: bson.A{"$mathDocs", bson.D{}}}}}}},
			{Key: "physics", Value: bson.D{{Key: "$first", Value: "$physics"}}},
			{Key: "chemistry", Value: bson.D{{Key: "$first", Value: "$chemistry"}}},
		}}},

		// Unwind and lookup for physics
		bson.D{{Key: "$unwind", Value: bson.D{{Key: "path", Value: "$physics"}, {Key: "preserveNullAndEmptyArrays", Value: true}}}},
		bson.D{{Key: "$addFields", Value: bson.D{
			{Key: "physicsObjectID", Value: bson.D{{Key: "$toObjectId", Value: "$physics"}}},
		}}},
		bson.D{{Key: "$lookup", Value: bson.D{
			{Key: "from", Value: "questions"},
			{Key: "localField", Value: "physicsObjectID"},
			{Key: "foreignField", Value: "_id"},
			{Key: "as", Value: "physicsDocs"},
		}}},
		bson.D{{Key: "$unwind", Value: bson.D{{Key: "path", Value: "$physicsDocs"}, {Key: "preserveNullAndEmptyArrays", Value: true}}}},
		bson.D{{Key: "$group", Value: bson.D{
			{Key: "_id", Value: "$_id"},
			{Key: "exam", Value: bson.D{{Key: "$first", Value: "$exam"}}},
			{Key: "date", Value: bson.D{{Key: "$first", Value: "$date"}}},
			{Key: "totalQuestions", Value: bson.D{{Key: "$first", Value: "$totalQuestions"}}},
			{Key: "mathematics", Value: bson.D{{Key: "$first", Value: "$mathematics"}}},
			{Key: "physics", Value: bson.D{{Key: "$push", Value: bson.D{{Key: "$ifNull", Value: bson.A{"$physicsDocs", bson.D{}}}}}}},
			{Key: "chemistry", Value: bson.D{{Key: "$first", Value: "$chemistry"}}},
		}}},

		// Unwind and lookup for chemistry
		bson.D{{Key: "$unwind", Value: bson.D{{Key: "path", Value: "$chemistry"}, {Key: "preserveNullAndEmptyArrays", Value: true}}}},
		bson.D{{Key: "$addFields", Value: bson.D{
			{Key: "chemistryObjectID", Value: bson.D{{Key: "$toObjectId", Value: "$chemistry"}}},
		}}},
		bson.D{{Key: "$lookup", Value: bson.D{
			{Key: "from", Value: "questions"},
			{Key: "localField", Value: "chemistryObjectID"},
			{Key: "foreignField", Value: "_id"},
			{Key: "as", Value: "chemistryDocs"},
		}}},
		bson.D{{Key: "$unwind", Value: bson.D{{Key: "path", Value: "$chemistryDocs"}, {Key: "preserveNullAndEmptyArrays", Value: true}}}},
		bson.D{{Key: "$group", Value: bson.D{
			{Key: "_id", Value: "$_id"},
			{Key: "exam", Value: bson.D{{Key: "$first", Value: "$exam"}}},
			{Key: "date", Value: bson.D{{Key: "$first", Value: "$date"}}},
			{Key: "totalQuestions", Value: bson.D{{Key: "$first", Value: "$totalQuestions"}}},
			{Key: "mathematics", Value: bson.D{{Key: "$first", Value: "$mathematics"}}},
			{Key: "physics", Value: bson.D{{Key: "$first", Value: "$physics"}}},
			{Key: "chemistry", Value: bson.D{{Key: "$push", Value: bson.D{{Key: "$ifNull", Value: bson.A{"$chemistryDocs", bson.D{}}}}}}},
		}}},

		// Combine arrays into a single questions object
		bson.D{{Key: "$project", Value: bson.D{
			{Key: "exam", Value: 1},
			{Key: "date", Value: 1},
			{Key: "totalQuestions", Value: 1},
			{Key: "questions", Value: bson.D{
				{Key: "mathematics", Value: "$mathematics"},
				{Key: "physics", Value: "$physics"},
				{Key: "chemistry", Value: "$chemistry"},
			}},
		}}},
	}

	cursor, err := db.Collection("exams").Aggregate(context.Background(), pipeline)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error!"})
		return
	}
	defer cursor.Close(context.Background())

	var results []bson.M
	if err = cursor.All(context.Background(), &results); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error!"})
		return
	}

	if len(results) < 1 {
		c.JSON(http.StatusNotFound, gin.H{"error": "exam not found!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "exam": results[0]})
}

func GetExams(c *gin.Context) {
	db := config.DB
	var results []bson.M
	filter := bson.M{}

	cursor, err := db.Collection("exams").Find(context.Background(), filter)
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
	c.JSON(http.StatusOK, gin.H{"success": true, "exams": results})
}

func GetReadyExams(c *gin.Context) {
	db := config.DB
	var results []bson.M
	filter := bson.M{"totalQuestions": 90}

	cursor, err := db.Collection("exams").Find(context.Background(), filter)
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
	c.JSON(http.StatusOK, gin.H{"success": true, "exams": results})

}

func SaveExam(c *gin.Context) {
	db := config.DB
	examId := c.Param("id")

	_id, err := primitive.ObjectIDFromHex(examId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	var body ExamBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var exam ExamBody
	err = db.Collection("exams").FindOne(context.Background(), bson.M{"_id": _id}).Decode(&exam)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "exam not found!"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}
	if exam.Questions.Chemistry == nil {
		println("Chemistry is nil")
	}
	//TODO:code shorting by itrating over struct
	for i, mathematicsQID := range body.Questions.Mathematics {
		if mathematicsQID != "" {
			exam.Questions.Mathematics[i] = mathematicsQID
		}
	}
	for i, physicsQID := range body.Questions.Physics {
		if physicsQID != "" {
			exam.Questions.Physics[i] = physicsQID
		}
	}
	for i, chemistryQID := range body.Questions.Chemistry {
		println(chemistryQID + ":")
		println(i)
		if chemistryQID != "" {
			exam.Questions.Chemistry[i] = chemistryQID
		}
	}

	totalQuestions := 0

	for _, mathematicsQID := range exam.Questions.Mathematics {
		if mathematicsQID != "" {
			totalQuestions++
		}
	}
	for _, physicsQID := range exam.Questions.Physics {
		if physicsQID != "" {
			totalQuestions++
		}
	}
	for _, chemistryQID := range exam.Questions.Chemistry {
		if chemistryQID != "" {
			totalQuestions++
		}
	}

	_, err = db.Collection("exams").UpdateOne(context.Background(), bson.M{"_id": _id}, bson.M{"$set": bson.M{"questions": exam.Questions, "totalQuestions": totalQuestions}})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "something went wrong!"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true})
}

func GetMinimalExam(c *gin.Context) {
	db := config.DB
	givenId := c.Param("id")
	_id, err := primitive.ObjectIDFromHex(givenId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	var exam ExamBody
	err = db.Collection("exams").FindOne(context.Background(), bson.M{"_id": _id}).Decode(&exam)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "exam not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "exam": exam})
}

// func GetRegisteredExams(c *gin.Context){

// }