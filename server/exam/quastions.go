package exam

import "github.com/gin-gonic/gin"

func GetQuestions(c *gin.Context) {
	exam := c.Param("exam")
	set := c.Param("set")

	switch exam {
	case "jee":
		{
			
		}
	}
}
