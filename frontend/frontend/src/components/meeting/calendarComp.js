import React, { useState, useEffect } from "react";
import axios from "axios";

import Calendar from "@toast-ui/react-calendar";
import "tui-calendar/dist/tui-calendar.css";

// If you use the default popups, use this.
import "tui-date-picker/dist/tui-date-picker.css";
import "tui-time-picker/dist/tui-time-picker.css";

import SideBar from "../layout/sideBar";
import Header from "../layout/header";
import myTheme from "./calendarTheme";
import * as config from '../../config';

export default function CalendarComp(props) {
  // State 생성
  const [inputs, setInputs] = useState({
    today: new Date(),
    schedule: []
  });

  const calendarRef = React.createRef();
  const scheduleArr = [];
  

  // 최초 세팅
  useEffect(() => {
    // getList();
  }, []);

  // 날짜 변경 콜백
  useEffect(() => {
    const calendarInstance = calendarRef.current.getInstance();
    calendarInstance.setDate(inputs.today);
  }, [inputs.today]);

  // 리스트 가져오기
  const getList = async () => {
    await getListAxios();
    // setScheduleState();
  };

  const getListAxios = () => {
    return new Promise((resolve, reject) => {
      axios
      .get(config.API_URL + "/reserve")
      .then((response) => {
        const data = response.data.reserves;
        const keys = Object.keys(data);
        const calendarInstance = calendarRef.current.getInstance();

        if ( keys.length > 0 ){
          keys.forEach(key => {
            const val = data[key];
            
            scheduleArr.push({
              id: val.reserve_id,
              calendarId: val.meeting_department_code,
              title: val.meeting_content,
              userName: val.reserve_user_name,
              place: val.meeting_place_code,
              category: "time",
              start: new Date(val.meeting_start_time).toString(),
              end: new Date(val.meeting_end_time).toString(),
            })

          });
          calendarInstance.createSchedules(scheduleArr);
        }

        resolve();
      })
      .catch((error) => {
        axiosError(error);
        reject();
      });
    })
  }
  getList();

  const setScheduleState = () => {
    return new Promise((resolve, reject)=>{
      setInputs({
        ...inputs,
        schedule: scheduleArr
      })
    })
  }

  // const setScheduleFromState = () => {
  //   if ( inputs.schedule.length > 0 ){
  //     const calendarInstance = calendarRef.current.getInstance();
  //     calendarInstance.createSchedules(inputs.schedule);
  //   }
  // }

  const getDate = (unit, date, num, symbol) => {
    let todayDate = new Date(date);

    if (symbol == "-") {
      num = -num;
    }

    switch (unit) {
      case "date":
        todayDate.setDate(todayDate.getDate() + num);
        break;

      case "hours":
        todayDate.setHours(todayDate.getHours() + num);
        break;

      case "minutes":
        todayDate.setMinutes(todayDate.getMinutes() + num);
        break;
    }

    return todayDate;
  };

  const openCreationPopup = () => {
    const calendarInstance = calendarRef.current.getInstance();
    calendarInstance.openCreationPopup([]);
  }

  const changeToday = (date) => {
    setInputs({
      ...inputs,
      today: date
    })
  }

  const goToday = () => {
    const calendarInstance = calendarRef.current.getInstance();
    calendarInstance.today();
    setInputs({
      ...inputs,
      today: new Date()
    })
  };

  const goNextWeek = () => {
    const calendarInstance = calendarRef.current.getInstance();
    calendarInstance.next();
    setInputs({
      ...inputs,
      today: getDate('date', inputs.today, 7, '+')
    })
  };

  const goPrevWeek = () => {
    const calendarInstance = calendarRef.current.getInstance();
    calendarInstance.prev();
    setInputs({
      ...inputs,
      today: getDate('date', inputs.today, 7, '-')
    })
  };

  const createSchedules = (event) => {
    const calendarInstance = calendarRef.current.getInstance();
    
    const formData = new FormData();
    formData.append("meetingStartTime", getTimeStamp(event.start));
    formData.append("meetingEndTime", getTimeStamp(event.end));
    formData.append("meetingPlaceCode", event.place);
    formData.append("meetingDepartmentCode", event.calendarId);
    formData.append("reserveUserName", event.userName);
    formData.append("meetingContent", event.title);

    axios
      .post(config.API_URL + "/reserve", formData)
      .then((response) => {
        console.log(response);
        const res = response.data;
        var schedule = {
          id: res.reserveId,
          calendarId: res.meetingDepartmentCode,
          title: res.meetingContent,
          userName: res.reserveUserName,
          place: res.meetingPlaceCode,
          category: "time",
          start: new Date(res.meetingStartTime).toString(),
          end: new Date(res.meetingEndTime).toString(),
        };
        
        calendarInstance.createSchedules([schedule]);
      })
      .catch((error) => {
        axiosError(error);
      });
      
  };

  function fillZeros(n, digits) {  
      var zero = '';  
      n = n.toString();  

      if (n.length < digits) {  
          for (var i = 0; i < digits - n.length; i++)  
              zero += '0';  
      }  
      return zero + n;  
  }  
    
  function getTimeStamp(date) {  
      var d = new Date(date);  

      var s = fillZeros(d.getFullYear(), 4) + '-' +  
              fillZeros(d.getMonth() + 1, 2) + '-' +  
              fillZeros(d.getDate(), 2) + ' ' +  
        
              fillZeros(d.getHours(), 2) + ':' +  
              fillZeros(d.getMinutes(), 2) + ':' +  
              fillZeros(d.getSeconds(), 2);  

      return s;  
  }  


  const updateSchedule = (event) => {
    const calendarInstance = calendarRef.current.getInstance();

    const formData = new FormData();
    formData.append("reserveId", event.schedule.id);
    formData.append("meetingStartTime", getTimeStamp(event.changes.start ? event.changes.start : event.schedule.start));
    formData.append("meetingEndTime", getTimeStamp(event.changes.end ? event.changes.end : event.schedule.end));
    formData.append("meetingPlaceCode", event.changes.place ? event.changes.place : event.schedule.place);
    formData.append("meetingDepartmentCode", event.changes.calendarId ? event.changes.calendarId : event.schedule.calendarId);
    formData.append("reserveUserName", event.changes.userName ? event.changes.userName : event.schedule.userName);
    formData.append("meetingContent", event.changes.title ? event.changes.title : event.schedule.title);

    axios
      .put(config.API_URL + "/reserve", formData)
      .then((response) => {
        calendarInstance.updateSchedule(event.schedule.id, event.schedule.calendarId, event.changes);
      })
      .catch((error) => {
        axiosError(error);
      });

  };

  const deleteSchedule = (event) => {
    const calendarInstance = calendarRef.current.getInstance();

    axios
      .delete(config.API_URL + "/reserve/"+ event.schedule.id)
      .then((response) => {
        console.log(response)
        calendarInstance.deleteSchedule(event.schedule.id, event.schedule.calendarId);
      })
      .catch((error) => {
        axiosError(error);
      });
      
  };

  const axiosError = (error) => {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
  };

  const MyComponent = () => (
    <Calendar
      ref={calendarRef}
      usageStatistics={false}
      theme={myTheme}
      height="900px"
      calendars={[
        {
          id: "MD",
          name: "MD",
          bgColor: "#42a5f5",
          borderColor: "#42a5f5",
        },
        {
          id: "MAD",
          name: "MAD",
          bgColor: "#ab47bc",
          borderColor: "#ab47bc",
        },
        {
          id: "ITD",
          name: "ITD",
          bgColor: "#ff7043",
          borderColor: "#ff7043",
        },
        {
          id: "SSD",
          name: "SSD",
          bgColor: "#26a69a",
          borderColor: "#26a69a",
        },
        {
          id: "RD",
          name: "RD",
          bgColor: "#5c6bc0",
          borderColor: "#5c6bc0",
        },
        {
          id: "IDAM",
          name: "IDAM",
          bgColor: "#ec407a",
          borderColor: "#ec407a",
        },
      ]}
      taskView={false}
      disableDblClick={true}
      disableClick={false}
      isReadOnly={false}
      month={{
        startDayOfWeek: 0,
      }}
      schedules={inputs.schedule}
      timezones={[
        {
          timezoneOffset: 540,
          displayLabel: "GMT+09:00",
          tooltip: "Seoul",
        },
      ]}
      useDetailPopup={true}
      useCreationPopup={true}
      week={{
        showTimezoneCollapseButton: true,
        timezonesCollapsed: true,
        hourStart: 7,
        hourEnd:20,
        narrowWeekend: true
      }}
      onBeforeCreateSchedule={createSchedules}
      onBeforeUpdateSchedule={updateSchedule}
      onBeforeDeleteSchedule={deleteSchedule}
    />
  );

  return (
    <div>
      <Header openCreationPopup={openCreationPopup}/>
      <div>
        <SideBar today={inputs.today} onChangeDate={changeToday}/>
        <div className="mainComponent">
          <div className="weekNavigator">
            <div className="text-center weekNavigator-month">
              <span className="weekNavigatorText">{inputs.today.getFullYear()}년 {inputs.today.getMonth()+1}월</span>
              <img src="images/btn_nextweek@3x.png" className="btn-nextWeek" onClick={goNextWeek}  />
              <img src="images/btn_preweek@3x.png" className="btn-prevWeek" onClick={goPrevWeek} />
              <img src="images/btn_today@3x.png" className="btn-today" onClick={goToday} />
            </div>
          </div>
          <MyComponent></MyComponent>
        </div>
      </div>
    </div>
  );
} 