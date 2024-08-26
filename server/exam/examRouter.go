package exam

import (
	"server/auth"

	"github.com/gin-gonic/gin"
)

func Exam(r *gin.Engine) {

	userProtected := r.Group("/",auth.AuthMiddleware("user"))
	userProtected.GET("/ready-exams",GetReadyExams)
	userProtected.GET("/exam/:id",GetStudentExam)
	userProtected.GET("/exam-minimal/:id",GetMinimalExam)
	userProtected.GET("/exam-registered/:exam",GetRegisteredExams)
	//TODO:exam-registerd to exam[s] in client and server
	userProtected.POST("/exam/:exam/:id",SubmitExam)	
	userProtected.POST("/register-exam/:exam/:id",Register)
	userProtected.GET("/result/:id",GetResult)
	userProtected.GET("/exams-attented/:exam",GetAttendedExams)
	
	adminProtected := r.Group("/admin",auth.AuthMiddleware("admin"))
	adminProtected.GET("/questions",GetQuestions)
	adminProtected.GET("/exam/:id",GetExam)
	adminProtected.GET("/question/:id",GetQuestion)
	adminProtected.GET("/exams",GetExams)
	adminProtected.GET("/topics",GetTopics)

	adminProtected.POST("/add-question",AddQuestion)
	adminProtected.POST("/exam/save/:id",SaveExam)
	adminProtected.POST("/exam",AddExam)
	adminProtected.POST("/topic",AddTopic)
}
