package auth

import (
	"context"
	"fmt"
	"net/http"
	"server/config"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

// var jwtSecret = []byte("my_secret_key")

type User struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type SignupUser struct {
	Email string `json:"email"`
	Name string `json:"name"`
	Password string `json:"password"`
	State string `json:"state"`
}

type Token struct {
	Token string `json:"token"`
} 

type Claims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

// func generateToken(username string) (string, error) {
// 	// Token expiration time
// 	expirationTime := time.Now().Add(24 * time.Hour)

// 	// Create the JWT claims, including the username and expiry time
// 	claims := &Claims{
// 		Username: username,
// 		StandardClaims: jwt.StandardClaims{
// 			ExpiresAt: expirationTime.Unix(),
// 		},
// 	}

// 	// Create the token
// 	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

// 	// Sign the token with our secret key
// 	return token.SignedString(jwtSecret)
// }

func Auth(r *gin.Engine) {
	r.POST("/login",Login)
	r.POST("/signup",Signup)
}

func Login(c *gin.Context){
	var user SignupUser
	if err := c.ShouldBindJSON(&user); err != nil{
		c.JSON(http.StatusBadRequest,gin.H{"error":err.Error()})
		return
	}

	password := user.Password

	db := config.DB

	err := db.Collection("users").FindOne(context.Background(),bson.M{"email":user.Email}).Decode(&user)
	if err != nil{
		if err == mongo.ErrNoDocuments{
			c.JSON(http.StatusUnauthorized,gin.H{"error":"password not matching or user not found"})
			return
		}else{
			c.JSON(http.StatusInternalServerError,gin.H{"error":"Database error"})
			return
		}
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password),[]byte(password))

	if err != nil {
		c.JSON(http.StatusUnauthorized,gin.H{"error":"password not matching or user not found"})
		return
	}
	
	var jwtKey = []byte("JWT_SECRET_KEY")
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["authorized"] = true
	claims["username"] = user.Name
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix()
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError,gin.H{"error":"Something went wrong"})
		return
	}
	c.SetCookie("name",user.Name ,1000000, "/" , "localhost" ,false,true)
	c.SetCookie("token",tokenString ,1000000, "/" , "localhost" ,false,true)

	c.JSON(http.StatusOK,gin.H{"Success":true,"user":user})

}

func Signup(c *gin.Context){
	var user SignupUser
	if err := c.ShouldBindJSON(&user); err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB

	filter := bson.M{"$or": []bson.M{
		{"email": user.Email},
	}}

	count, err := db.Collection("users").CountDocuments(context.Background(), filter)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
			return
		}

	if count > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User already exists"})
		return
	}

	hashPassword , err := bcrypt.GenerateFromPassword([]byte(user.Password),bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError,gin.H{"error":"something went wrong"})
		return
	}

	user.Password = string(hashPassword)

	result ,err := db.Collection("users").InsertOne(context.Background(),user)

	if err != nil{
		c.JSON(http.StatusInternalServerError,gin.H{"error":"Database error"})
		return
	}

	fmt.Println(result)

	var jwtKey = []byte("JWT_SECRET_KEY")
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["authorized"] = true
	claims["username"] = user.Name
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix()
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError,gin.H{"error":"Something went wrong"})
		return
	}
	c.SetCookie("name",user.Name ,1000000, "/" , "localhost" ,false,true)
	c.SetCookie("token",tokenString ,1000000, "/" , "localhost" ,false,true)

	c.JSON(http.StatusOK,gin.H{"Success":true,"user":user})
}