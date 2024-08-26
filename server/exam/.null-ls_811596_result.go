package exam

import (
	"context"
	"net/http"
	"server/config"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type AttendedExam struct {
	Email    string            `json:"email"`
	Exam     string            `json:"exam"`
	Response map[string]string `json:"response"`
}

type QuestionAnswerKey struct {
	Answer string `json:"answer"`
	Type   string `json:"type"`
}

type AnswerKey struct {
	Date      string `json:"date"`
	Questions struct {
		Mathematics []QuestionAnswerKey `json:"mathematics"`
		Physics     []QuestionAnswerKey `json:"physics"`
		Chemistry   []QuestionAnswerKey `json:"chemistry"`
	}
}

type QuestionAnalysis struct {
	Mathematics struct{
		Attended int `json:"attended"`
		Right int `json:"right"`
		Wrong int `json:"wrong"`
		NotAttended int `json:"notAttended"`
	} `json:"mathematics"`
	Physics     struct{
		Attended int `json:"attended"`
		Right int `json:"right"`
		Wrong int `json:"wrong"`
		NotAttended int `json:"notAttended"`
	} `json:"physics"`
	Chemistry   struct{
		Attended int `json:"attended"`
		Right int `json:"right"`
		Wrong int `json:"wrong"`
		NotAttended int `json:"notAttended"`
	} `json:"chemistry"`
}

type Marks struct{
	Mathmatics int `json:"mathematics"`
	Physics int `json:"physics"`
	Chemistry int `json:"chemistry"`
}

func GetResult(c *gin.Context) {
	email, exist := c.Get("userEmail")
	if !exist {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "something went wrong!"})
		return
	}
	println(email)
	id := c.Param("id")
	_id, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "something went wrong!"})
		return
	}
	db := config.DB
	var response AttendedExam

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
							{Key: "answer", Value: "$$item.answer"},
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
							{Key: "answer", Value: "$$item.answer"},
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
							{Key: "answer", Value: "$$item.answer"},
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

	var results []AnswerKey
	if err = cursor.All(context.Background(), &results); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error!"})
		return
	}
	if len(results) < 1 {
		c.JSON(http.StatusNotFound, gin.H{"error": "exam not found!"})
		return
	}

	err = db.Collection("jee-users").FindOne(context.Background(), bson.M{"email": email, "exam": id}).Decode(&response)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "somthing went wrong!"})
		return
	}

	var marks Marks
	var resultAnalysis QuestionAnalysis
	
	for question, response := range response.Response {
		parts := strings.Split(question, "-")
		questionIndex, err := strconv.Atoi(parts[1])
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "something went wrong!"})
			return
		}
		switch parts[0] {
		case "m":
			{
				resultAnalysis.Mathematics.Attended += 1
				if results[0].Questions.Mathematics[questionIndex].Answer == response {
					resultAnalysis.Mathematics.Right += 1
					marks.Mathmatics += 4
				} else {
					resultAnalysis.Mathematics.Wrong += 1
					marks.Mathmatics -= 1
				}
			}
		case "p":
			{
				resultAnalysis.Physics.Attended += 1
				if results[0].Questions.Physics[questionIndex].Answer == response {
					resultAnalysis.Physics.Right += 1
					marks.Physics += 4
				} else {
					resultAnalysis.Physics.Wrong += 1
					marks.Physics -= 1
				}
			}
		case "c":
			{
				resultAnalysis.Chemistry.Attended += 1
				if results[0].Questions.Chemistry[questionIndex].Answer == response {
					resultAnalysis.Chemistry.Right += 1
					marks.Chemistry += 4
				} else {
					resultAnalysis.Chemistry.Wrong += 1
					marks.Chemistry -= 1
				}
			}
		}
	}
	

	resultAnalysis.Mathematics.NotAttended = len(results[0].Questions.Mathematics) - resultAnalysis.Mathematics.Attended
	resultAnalysis.Physics.NotAttended = len(results[0].Questions.Physics) - resultAnalysis.Physics.Attended
	resultAnalysis.Chemistry.NotAttended = len(results[0].Questions.Chemistry) - resultAnalysis.Chemistry.Attended
	
	c.JSON(http.StatusOK, gin.H{"success":true,"marks": marks,"analysis":resultAnalysis})
}
