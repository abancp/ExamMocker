package config

import (
	"context"
	"fmt"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var DB *mongo.Database

func ConnectDb() {
	mongoURL := os.Getenv("MONGO_URL")
	clientOptions := options.Client().ApplyURI(mongoURL)
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		panic(err)
	}

	// Ping the MongoDB server to check the connection
	err = client.Ping(context.Background(), nil)
	if err != nil {
		panic(err)
	}

	fmt.Println("Connected to MongoDB!")
	DB = client.Database("ExamMocker")
}