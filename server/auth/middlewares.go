package auth

import (
	"context"
	"net/http"
	"os"
	"server/config"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/patrickmn/go-cache"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var roleCache *cache.Cache

func init() {
	// Initialize the cache with a default expiration time of 5 minutes, and purging every 10 minutes
	roleCache = cache.New(5*time.Minute, 10*time.Minute)
}

func AuthMiddleware(role string) gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString, err := c.Cookie("token")
		if err != nil {
			println(err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			c.Abort()
			return
		}
		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			c.Abort()
			return
		}
		c.Set("userEmail",claims.Email)	
		if role == "user" {
			c.Next()
		} else if role == "admin" {

			if cacheRole, found := roleCache.Get(claims.Email); found {
				if cacheRole == role {
					c.Next()
					return
				}
				c.JSON(http.StatusForbidden, gin.H{"error": "permission denied!"})
				c.Abort()
				return
			}

			db := config.DB
			var user SignupUser
			err := db.Collection("users").FindOne(context.Background(), bson.M{"email": claims.Email}).Decode(&user)
			if err != nil {
				if err == mongo.ErrNoDocuments {
					c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
					c.Abort()
					return
				}
				c.JSON(http.StatusInternalServerError, gin.H{"error": "something went wrong!"})
				c.Abort()
				return
			}
			// println("user")
			if !user.Admin {
				roleCache.Set(claims.Email, "user", cache.DefaultExpiration)
				c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
				c.Abort()
				return
			}
			roleCache.Set(claims.Email, "admin", cache.DefaultExpiration)
			c.Next()
		}
	}
}
