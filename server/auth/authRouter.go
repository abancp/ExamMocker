package auth

import "github.com/gin-gonic/gin"

func Auth(r *gin.Engine) {
	r.POST("/login",Login)
	r.POST("/signup",Signup)
	r.GET("/validate-token",ValidateToken)
}