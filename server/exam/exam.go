package exam

import "github.com/gin-gonic/gin"

func Exam(r *gin.Engine) {
	r.POST("/register/:exam",Register)
}
