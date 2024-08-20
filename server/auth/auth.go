package auth

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"server/config"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

// var jwtSecret = []byte("my_secret_key")

type SignupUser struct {
	Email    string `json:"email"`
	Name     string `json:"name"`
	Password string `json:"password"`
	State    string `json:"state"`
	Admin    bool   `json:"admin"`
}

type Token struct {
	Token string `json:"token"`
}

type Claims struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Admin    bool `json:"admin"`
	jwt.StandardClaims
}

func Login(c *gin.Context) {
	var user SignupUser
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	password := user.Password

	db := config.DB

	err := db.Collection("users").FindOne(context.Background(), bson.M{"email": user.Email}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "password not matching or user not found"})
			return
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
			return
		}
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "password not matching or user not found"})
		return
	}

	var jwtKey = []byte(os.Getenv("JWT_SECRET"))
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["authorized"] = true
	claims["username"] = user.Name
	claims["email"] = user.Email
	claims["admin"] = user.Admin
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix()
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Something went wrong"})
		return
	}
	cookie :=&http.Cookie{
		Name: "token",
		Value: tokenString,
		Path: "/",
		Domain: os.Getenv("SERVER_DOMAIN"),
		MaxAge: 1000000,
		Secure: true,
		HttpOnly: false,
		SameSite: http.SameSiteNoneMode,
	}
	http.SetCookie(c.Writer,cookie)
	// c.SetCookie("name", user.Name, 1000000, "/", os.Getenv("SERVER_DOMAIN"), true, false)
	// c.SetCookie("token", tokenString, 1000000, "/", os.Getenv("SERVER_DOMAIN"), true, false)
	user.Password = ""
	c.JSON(http.StatusOK, gin.H{"success": true, "user": user})

}

func Signup(c *gin.Context) {
	var user SignupUser
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	user.Admin = false

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

	hashPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "something went wrong"})
		return
	}

	user.Password = string(hashPassword)

	result, err := db.Collection("users").InsertOne(context.Background(), user)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	fmt.Println(result)

	var jwtKey = []byte(os.Getenv("JWT_SECRET"))
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["authorized"] = true
	claims["username"] = user.Name
	claims["email"] = user.Email
	claims["admin"] = user.Admin
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix()
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Something went wrong"})
		return
	}
	cookie :=&http.Cookie{
		Name: "token",
		Value: tokenString,
		Path: "/",
		Domain: os.Getenv("SERVER_DOMAIN"),
		MaxAge: 1000000,
		Secure: true,
		HttpOnly: false,
		SameSite: http.SameSiteNoneMode,
	}
	http.SetCookie(c.Writer,cookie)
	// c.SetCookie("name", user.Name, 1000000, "/", os.Getenv("SERVER_DOMAIN"), true, false)
	// c.SetCookie("token", tokenString, 1000000, "/", os.Getenv("SERVER_DOMAIN"), true, false)
	user.Password = ""
	c.JSON(http.StatusOK, gin.H{"success": true, "user": user})

}

func ValidateToken(c *gin.Context) {
	tokenString, err := c.Cookie("token")
	println(tokenString)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	var jwtKey = []byte(os.Getenv("JWT_SECRET"))

	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "claims": claims})
}
