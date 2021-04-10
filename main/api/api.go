package api

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"

	_ "github.com/go-sql-driver/mysql"
)

func GetReservation(c *gin.Context) {

	reserveId := c.Param("reserveId")

	db, err := sql.Open("mysql", "idam:BNSoft2020@@tcp(ultrawaveshop.co.kr:31001)/test")
	if err != nil {
		log.Fatal(err)
	}

	rows, err := db.Query("SELECT * FROM reservation WHERE reserve_id = ?", reserveId)
	columns, _ := rows.Columns()
	count := len(columns)
	values := make([]interface{}, count) // interface는 java interface와 같다
	valuePtrs := make([]interface{}, count)

	final_result := map[int]map[string]string{}
	result_id := 0

	if err != nil {
		log.Fatal(err)
	}

	defer db.Close()

	for rows.Next() {

		for i, _ := range columns {
			valuePtrs[i] = &values[i]
		}

		rows.Scan(valuePtrs...) // scan에 포인터를 넘겨서 포인터에 값을 직접 넣는다.

		tmp_struct := map[string]string{}

		for i, col := range columns {
			var v interface{}
			val := values[i]
			b, ok := val.([]byte) // []byte 타입으로 interface를 가져옴
			if ok {
				v = string(b)
				tmp_struct[col] = fmt.Sprintf("%s", v)
			} else {
				v = val
				tmp_struct[col] = fmt.Sprintf("%d", v)
			}

		}

		final_result[result_id] = tmp_struct
		result_id++

	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "get Success",
		"result":    final_result,
		"reserveId": reserveId,
	})

}

func GetReservationList(c *gin.Context) {

	db, err := sql.Open("mysql", "idam:BNSoft2020@@tcp(ultrawaveshop.co.kr:31001)/test")
	if err != nil {
		log.Fatal(err)
	}

	rows, err := db.Query("SELECT * FROM reservation")

	columns, _ := rows.Columns()
	count := len(columns)
	values := make([]interface{}, count)
	valuePtrs := make([]interface{}, count)

	final_result := map[int]map[string]string{}
	result_id := 0

	if err != nil {
		log.Fatal(err)
	}

	defer db.Close()

	for rows.Next() {
		for i, _ := range columns {
			valuePtrs[i] = &values[i]

		}
		rows.Scan(valuePtrs...)

		tmp_struct := map[string]string{}

		for i, col := range columns {
			var v interface{}
			val := values[i]
			b, ok := val.([]byte)
			if ok {
				v = string(b)
				tmp_struct[col] = fmt.Sprintf("%s", v)
			} else {
				v = val
				tmp_struct[col] = fmt.Sprintf("%d", v)
			}

		}

		final_result[result_id] = tmp_struct
		result_id++

	}

	c.JSON(http.StatusOK, gin.H{
		"message":         "get Success ",
		"connect success": db,
		"users":           final_result,
	})

}

func AddReservation(c *gin.Context) {

	meetingStartTime := c.DefaultPostForm("meetingStartTime", "current_timestamp()") // 회의 시작시간
	meetingEndTime := c.DefaultPostForm("meetingEndTime", "current_timestamp()")     // 회의 종료시간
	meetingPlaceCode := c.DefaultPostForm("meetingPlaceCode", "01")                  // 회의 장소 코드
	meetingDepartmentCode := c.DefaultPostForm("meetingDepartmentCode", "01")        // 예약 부서 코드
	reserveUserName := c.DefaultPostForm("reserveUserName", "")                      // 예약자명
	meetingContent := c.DefaultPostForm("meetingContent", "")                        // 회의 내용 ( 메모 )
	regUser := reserveUserName
	modUser := reserveUserName

	db, err := sql.Open("mysql", "idam:BNSoft2020@@tcp(ultrawaveshop.co.kr:31001)/test")
	if err != nil {
		log.Fatal(err)
	}

	result, err := db.Exec("INSERT INTO reservation (meeting_start_time, meeting_end_time, meeting_place_code, meeting_department_code, reserve_user_name, meeting_content, reg_user, mod_user) VALUES(?, ?, ?, ?, ?, ?, ?, ?)", meetingStartTime, meetingEndTime, meetingPlaceCode, meetingDepartmentCode, reserveUserName, meetingContent, regUser, modUser)
	if err != nil {
		log.Fatal(err)
	}

	defer db.Close()
	c.JSON(http.StatusOK, gin.H{
		"message":               "post Success",
		"meetingStartTime":      meetingStartTime,
		"meetingEndTime":        meetingEndTime,
		"meetingPlaceCode":      meetingPlaceCode,
		"meetingDepartmentCode": meetingDepartmentCode,
		"reserveUserName":       reserveUserName,
		"meetingContent":        meetingContent,
		"regUser":               regUser,
		"modUser":               modUser,
		"result":                result,
		"err":                   err,
	})
}

func ModifyReservation(c *gin.Context) {

	reserveId := c.PostForm("reserveId")                                             // 예약 일련번호
	meetingStartTime := c.DefaultPostForm("meetingStartTime", "current_timestamp()") // 회의 시작시간
	meetingEndTime := c.DefaultPostForm("meetingEndTime", "current_timestamp()")     // 회의 종료시간
	meetingPlaceCode := c.DefaultPostForm("meetingPlaceCode", "01")                  // 회의 장소 코드
	meetingDepartmentCode := c.DefaultPostForm("meetingDepartmentCode", "01")        // 예약 부서 코드
	reserveUserName := c.DefaultPostForm("reserveUserName", "")                      // 예약자명
	meetingContent := c.DefaultPostForm("meetingContent", "")                        // 회의 내용 ( 메모 )
	modUser := reserveUserName

	if reserveId == "" {
		log.Fatal("no have reserveID")
	}

	db, err := sql.Open("mysql", "idam:BNSoft2020@@tcp(ultrawaveshop.co.kr:31001)/test")
	if err != nil {
		log.Fatal(err)
	}

	result, err := db.Exec("UPDATE reservation SET meeting_start_time = ?, meeting_end_time = ?, meeting_place_code = ?, meeting_department_code = ?, reserve_user_name = ?, meeting_content = ?, mod_user = ? WHERE reserve_id = ?", meetingStartTime, meetingEndTime, meetingPlaceCode, meetingDepartmentCode, reserveUserName, meetingContent, modUser, reserveId)
	if err != nil {
		log.Fatal(err)
	}

	defer db.Close()
	c.JSON(http.StatusOK, gin.H{
		"message":               "put Success",
		"meetingStartTime":      meetingStartTime,
		"meetingEndTime":        meetingEndTime,
		"meetingPlaceCode":      meetingPlaceCode,
		"meetingDepartmentCode": meetingDepartmentCode,
		"reserveUserName":       reserveUserName,
		"meetingContent":        meetingContent,
		"modUser":               modUser,
		"result":                result,
		"err":                   err,
	})
}

func DeleteReservation(c *gin.Context) {

	reserveId := c.PostForm("reserveId") // 예약 일련번호
	if reserveId == "" {
		log.Fatal("no have reserveID")
	}

	db, err := sql.Open("mysql", "idam:BNSoft2020@@tcp(ultrawaveshop.co.kr:31001)/test")
	if err != nil {
		log.Fatal(err)
	}

	result, err := db.Exec("DELETE FROM reservation WHERE reserve_id = ?", reserveId)
	if err != nil {
		log.Fatal(err)
	}

	defer db.Close()

	c.JSON(http.StatusOK, gin.H{
		"message": "delete Success",
		"result":  result,
		"err":     err,
	})
}
