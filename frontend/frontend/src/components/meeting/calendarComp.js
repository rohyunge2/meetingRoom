import { Link, useHistory } from "react-router-dom";
import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

import Calendar from "@toast-ui/react-calendar";
import "tui-calendar/dist/tui-calendar.css";

// If you use the default popups, use this.
import "tui-date-picker/dist/tui-date-picker.css";
import "tui-time-picker/dist/tui-time-picker.css";

export default function CalendarComp(props) {
  // State 생성
  const [inputs, setInputs] = useState({
    pageSize: 5,
    pageNum: 5,
  });

  useEffect(() => {
    // getList(1, common.isMobile());
  }, []);

  // 컴포넌트 이동
  const history = useHistory();

  // 리스트 가져오기
  const getList = (page, isMobile) => {
    axios
      .get("url")
      .then((response) => {
        console.log("response", response);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
      });
  };

  const onChangeState = (e, type) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const myTheme = {
    // Theme object to extends default dark theme.
  };

  const today = new Date();

  const getDate = (unit, date, num, symbol) => {
    let todayDate = new Date(date);
    let nextDate = null;

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

  const calendarRef = React.createRef();
  // const calendarInstance = calendarRef.current.getInstance();
  // calendarInstance.next();

  const createSchedules = (event) => {
    const calendarInstance = calendarRef.current.getInstance();

    var schedule = {
      id: "1",
      calendarId: event.calendarId,
      title: event.title,
      location: event.location,
      category: "time",
      start: event.start,
      end: event.end,
    };

    calendarInstance.createSchedules([schedule]);
  };

  const updateSchedule = (event) => {
    const calendarInstance = calendarRef.current.getInstance();

    calendarInstance.updateSchedule(event.schedule.id, event.schedule.calendarId, event.changes);
  };

  const deleteSchedule = (event) => {
    const calendarInstance = calendarRef.current.getInstance();
    calendarInstance.deleteSchedule(event.schedule.id, event.schedule.calendarId);
  };

  const MyComponent = () => (
    <Calendar
      ref={calendarRef}
      usageStatistics={false}
      height="900px"
      calendars={[
        {
          id: "IDAM",
          name: "IDAM",
          bgColor: "#9e5fff",
          borderColor: "#9e5fff",
        },
        {
          id: "SSD",
          name: "SSD",
          bgColor: "#00a9ff",
          borderColor: "#00a9ff",
        },
      ]}
      taskView={false}
      disableDblClick={true}
      disableClick={false}
      isReadOnly={false}
      month={{
        startDayOfWeek: 0,
      }}
      schedules={[
        {
          id: "1",
          calendarId: "IDAM",
          title: "라이브커머스 회의",
          category: "time",
          start: today.toISOString(),
          end: getDate("hours", today, 3, "+").toISOString(),
        },
      ]}
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
      }}
      onBeforeCreateSchedule={createSchedules}
      onBeforeUpdateSchedule={updateSchedule}
      onBeforeDeleteSchedule={deleteSchedule}
    />
  );

  return (
    <div>
      <MyComponent></MyComponent>
      {/* <button onClick={handleClickNextButton}>Go next!</button> */}
    </div>
  );
}
