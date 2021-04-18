package main

import (
	"github.com/gin-gonic/gin"
	"github.com/rohyunge/main/api"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	router := gin.Default()

	router.Use(CORSMiddleware())

	router.GET("/reserve/:reserveId", api.GetReservation)
	router.GET("/reserve", api.GetReservationList)
	router.POST("/reserve", api.AddReservation)
	router.PUT("/reserve", api.ModifyReservation)
	router.DELETE("/reserve/:reserveId", api.DeleteReservation)

	router.Run()

}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Header("Access-Control-Allow-Methods", "GET, DELETE, POST, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
