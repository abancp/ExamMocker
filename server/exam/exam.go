package exam

import "github.com/gin-gonic/gin"

func Exam(r *gin.Engine) {
	r.POST("/register/:exam",Register)
	r.POST("/admin/add-question",AddQuestion)
	r.GET("/admin/questions",GetQuestions)
	r.GET("/admin/question/:id",GetQuestion)
	r.GET("/admin/exams",GetExams)
	r.GET("/ready-exams",GetReadyExams)
	r.GET("/admin/exam/:id",GetExam)
	r.POST("/admin/exam/save/:id",SaveExam)
	r.POST("/admin/exam",AddExam)
	r.GET("/admin/topics",GetTopics)
	r.POST("/admin/topic",AddTopic)
}
