package exam

import (
	"context"
	"fmt"
	"net/http"
	"server/config"
	"time"

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

type SubmitExamBody struct {
	Response map[string]interface{} `json:"response"`
	State    map[string]interface{} `json:"state"`
	Key      string                 `json:"key"`
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

//func DeleteExam(c *gin.Context){

//}

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

	c.JSON(http.StatusOK, gin.H{"success": true, "exam": results[0]})
}

func GetStudentExam(c *gin.Context) {
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
		// ... previous stages ...

		// Combine arrays into a single questions object
		bson.D{{Key: "$project", Value: bson.D{
			{Key: "exam", Value: 1},
			{Key: "date", Value: 1},
			{Key: "totalQuestions", Value: 1},
			{Key: "questions", Value: bson.D{
				{Key: "mathematics", Value: bson.D{
					{Key: "$map", Value: bson.D{
						{Key: "input", Value: "$mathematics"},
						{Key: "as", Value: "item"},
						{Key: "in", Value: bson.D{
							{Key: "_id", Value: "$$item._id"},
							{Key: "options", Value: "$$item.options"},
							{Key: "question", Value: "$$item.question"},
							{Key: "subject", Value: "$$item.subject"},
							{Key: "topic", Value: "$$item.topic"},
							{Key: "type", Value: "$$item.type"},
						}},
					}},
				}},
				{Key: "physics", Value: bson.D{
					{Key: "$map", Value: bson.D{
						{Key: "input", Value: "$physics"},
						{Key: "as", Value: "item"},
						{Key: "in", Value: bson.D{
							{Key: "_id", Value: "$$item._id"},
							{Key: "options", Value: "$$item.options"},
							{Key: "question", Value: "$$item.question"},
							{Key: "subject", Value: "$$item.subject"},
							{Key: "topic", Value: "$$item.topic"},
							{Key: "type", Value: "$$item.type"},
						}},
					}},
				}},
				{Key: "chemistry", Value: bson.D{
					{Key: "$map", Value: bson.D{
						{Key: "input", Value: "$chemistry"},
						{Key: "as", Value: "item"},
						{Key: "in", Value: bson.D{
							{Key: "_id", Value: "$$item._id"},
							{Key: "options", Value: "$$item.options"},
							{Key: "question", Value: "$$item.question"},
							{Key: "subject", Value: "$$item.subject"},
							{Key: "topic", Value: "$$item.topic"},
							{Key: "type", Value: "$$item.type"},
						}},
					}},
				}},
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
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusOK, gin.H{"success": true, "exams": results})
			return
		}
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

func GetRegisteredExams(c *gin.Context) {
	userEmail, exist := c.Get("userEmail")
	if !exist {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "something went wrong!"})
		return
	}
	exam := c.Param("exam")
	db := config.DB
	switch exam {
	case "jee":
		{

			pipeline := mongo.Pipeline{
				bson.D{{Key: "$match", Value: bson.M{"email": userEmail}}},
				bson.D{{Key: "$group", Value: bson.D{
					{Key: "_id", Value: nil},
					{Key: "exams", Value: bson.D{{Key: "$push", Value: "$exam"}}},
				}}},
				bson.D{{Key: "$project", Value: bson.D{
					{Key: "_id", Value: 0},
					{Key: "exams", Value: 1},
				}}},
			}

			cursor, err := db.Collection("jee-users").Aggregate(context.Background(), pipeline)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "something went wrong!"})
				return
			}

			var results []bson.M
			if err = cursor.All(context.Background(), &results); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "something went wrong!"})
				return
			}
			if len(results) < 1 {
				c.JSON(http.StatusOK, gin.H{"success": true, "exams": results})
				return
			}
			c.JSON(http.StatusOK, gin.H{"success": true, "exams": results[0]})
			return
		}
	default:
		{
			c.JSON(http.StatusNotFound, gin.H{"error": "invalid exam"})
			return
		}
	}
}

func SubmitExam(c *gin.Context) {
	userEmail, exist := c.Get("userEmail")
	if !exist {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "something went wrong!"})
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
			var body SubmitExamBody
			if err := c.ShouldBindJSON(&body); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			var exam ExamBody
			err := db.Collection("exams").FindOne(context.Background(), bson.M{"_id": _id}).Decode(&exam)
			if err != nil {
				if err == mongo.ErrNoDocuments {
					c.JSON(http.StatusNotFound, gin.H{"error": "exam not found"})
					return
				}
				c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
				return
			}
			layout := "2006-01-02T15:04"
			parsedTime, err := time.Parse(layout, exam.Date)
			examTime := parsedTime.UnixNano() / int64(time.Millisecond)
			currentTime := time.Now()
			submittedTime := currentTime.UnixNano() / int64(time.Millisecond)
			if err != nil {
				fmt.Println("Error parsing time:", err)
				return
			}
			_, err = db.Collection("jee-users").UpdateOne(context.Background(), bson.M{"exam": id, "email": userEmail}, bson.M{"$set": bson.M{"response": body.Response, "state": body.State, "submittedTime": submittedTime}})
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "something went wrong!"})
				return
			}
			if submittedTime > (examTime + 86400000) {
				c.JSON(http.StatusOK, gin.H{"success": true, "message": "Submitted successfully!,But time over . we will verify that"})
				return
			}
			c.JSON(http.StatusOK, gin.H{"success": true, "message": "Submitted successfully!"})
			return
		}
	default:
		{
			c.JSON(http.StatusNotFound, gin.H{"error": "invalid exam"})
			return
		}

	}

}

func GetAttendedExams(c *gin.Context) {
	email, exist := c.Get("userEmail")
	if !exist {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "something went wrong!"})
		return
	}
	exam := c.Param("exam")
	db := config.DB
	var exams []bson.M
	switch exam {
	case "jee":
		{
			cursor, err := db.Collection("jee-users").Find(context.Background(), bson.M{"email": email, "response": bson.M{"$exists": true}})
			if err != nil {
				if err == mongo.ErrNoDocuments {
					c.JSON(http.StatusOK, gin.H{"success": true, "exams": exams})
				}
			}

			defer cursor.Close(context.Background())

			for cursor.Next(context.Background()) {
				var exam bson.M
				err := cursor.Decode(&exam)
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
					return
				}
				exams = append(exams, exam)
			}
			if err := cursor.Err(); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, gin.H{"success": true, "exams": exams})
		}
	default:
		{
			c.JSON(http.StatusNotFound, gin.H{"error": "exam not found!"})
			return
		}
	}
}

func DeleteExam(c *gin.Context) {
	id := c.Param("id")
	_id, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "something went wrong!"})
		return
	}
	db := config.DB
	_, err = db.Collection("exams").DeleteOne(context.Background(), bson.M{"_id": _id})
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "exam not found!"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "something went wrong!"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "exam deleted successfully!"})
}

func GetRegisteredExamTimes(c *gin.Context) {
	userEmail, exist := c.Get("userEmail")
	if !exist {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "somthings went wrong!"})
		return
	}
	print(userEmail)
	var results []bson.M
	db := config.DB
	pipeline := mongo.Pipeline{
		bson.D{
			{Key: "$match", Value: bson.D{
				{Key: "submittedTime", Value: bson.D{{Key: "$exists", Value: false}}},
			}},
		},
		bson.D{
			{Key: "$addFields", Value: bson.D{
				{Key: "examObjectId", Value: bson.D{
					{Key: "$toObjectId", Value: "$exam"}, // Convert exam string to ObjectId
				}},
			}},
		},
		bson.D{
			{Key: "$lookup", Value: bson.D{
				{Key: "from", Value: "exams"},
				{Key: "let", Value: bson.D{{Key: "examId", Value: "$examObjectId"}}}, // Define a variable for use in the pipeline
				{Key: "pipeline", Value: mongo.Pipeline{
					bson.D{{Key: "$match", Value: bson.D{
						{Key: "$expr", Value: bson.D{
							{Key: "$eq", Value: bson.A{"$_id", "$$examId"}}, // Match documents by ObjectId
						}},
					}}},
					bson.D{{Key: "$project", Value: bson.D{
						{Key: "_id", Value: 1},      // Include _id field
						{Key: "date", Value: 1}, // Include examDate field
					}}},
				}},
				{Key: "as", Value: "examDetails"},
			}},
		},
		bson.D{
			{Key: "$unwind", Value: bson.D{
				{Key: "path", Value: "$examDetails"},
				{Key: "preserveNullAndEmptyArrays", Value: true}, // Keep documents that do not have a match
			}},
		},
		bson.D{
			{Key: "$replaceRoot", Value: bson.D{
				{Key: "newRoot", Value: "$examDetails"}, // Replace the root with examDetails object
			}},
		},
		bson.D{
			{Key: "$project", Value: bson.D{
				{Key: "_id", Value: 1},
				{Key: "date", Value: "$date"}, // Ensure the final field is named 'date'
			}},
		},
	}

	cursor, err := db.Collection("jee-users").Aggregate(context.Background(), pipeline)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "something went wrong!"})
		return
	}
	defer cursor.Close(context.Background())

	// Iterate through the results
	if err = cursor.All(context.Background(), &results); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "somethins went wrong!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "exams": results})
}

func GetAttendedExamTimes(c *gin.Context) {
	userEmail, exist := c.Get("userEmail")
	if !exist {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "somthings went wrong!"})
		return
	}
	print(userEmail)
	var results []bson.M
	db := config.DB
	pipeline := mongo.Pipeline{
		bson.D{
			{Key: "$match", Value: bson.D{
				{Key: "submittedTime", Value: bson.D{{Key: "$exists", Value: true}}},
			}},
		},
		bson.D{
			{Key: "$addFields", Value: bson.D{
				{Key: "examObjectId", Value: bson.D{
					{Key: "$toObjectId", Value: "$exam"}, // Convert exam string to ObjectId
				}},
			}},
		},
		bson.D{
			{Key: "$lookup", Value: bson.D{
				{Key: "from", Value: "exams"},
				{Key: "let", Value: bson.D{{Key: "examId", Value: "$examObjectId"}}}, // Define a variable for use in the pipeline
				{Key: "pipeline", Value: mongo.Pipeline{
					bson.D{{Key: "$match", Value: bson.D{
						{Key: "$expr", Value: bson.D{
							{Key: "$eq", Value: bson.A{"$_id", "$$examId"}}, // Match documents by ObjectId
						}},
					}}},
					bson.D{{Key: "$project", Value: bson.D{
						{Key: "_id", Value: 1},      // Include _id field
						{Key: "date", Value: 1}, // Include examDate field
					}}},
				}},
				{Key: "as", Value: "examDetails"},
			}},
		},
		bson.D{
			{Key: "$unwind", Value: bson.D{
				{Key: "path", Value: "$examDetails"},
				{Key: "preserveNullAndEmptyArrays", Value: true}, // Keep documents that do not have a match
			}},
		},
		bson.D{
			{Key: "$replaceRoot", Value: bson.D{
				{Key: "newRoot", Value: "$examDetails"}, // Replace the root with examDetails object
			}},
		},
		bson.D{
			{Key: "$project", Value: bson.D{
				{Key: "_id", Value: 1},
				{Key: "date", Value: "$date"}, // Ensure the final field is named 'date'
			}},
		},
	}

	cursor, err := db.Collection("jee-users").Aggregate(context.Background(), pipeline)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "something went wrong!"})
		return
	}
	defer cursor.Close(context.Background())

	// Iterate through the results
	if err = cursor.All(context.Background(), &results); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "somethins went wrong!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "exams": results})
}
