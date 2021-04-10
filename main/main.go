package main

import (
	"github.com/gin-gonic/gin"
	"github.com/rohyunge/main/api"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	router := gin.Default()

	router.GET("/reserve/:reserveId", api.GetReservation)
	router.GET("/reserve", api.GetReservationList)
	router.POST("/reserve", api.AddReservation)
	router.PATCH("/reserve", api.ModifyReservation)
	router.DELETE("/reserve", api.DeleteReservation)

	router.Run()

}
