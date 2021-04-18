import CalendarSelector from 'react-calendar';
import React, { useState } from 'react'
import 'react-calendar/dist/Calendar.css';

export default function SideBar(props) {

  const changeDate = (date) => {
    props.onChangeDate(date);
  }

  return (
    <div className="sidebar">
        <CalendarSelector
          className="mb30 no-border"
          onChange={changeDate}
          value={props.today}
          calendarType="US"
          locale="en-US"
        />
        <div className="ml20">부서별 예약현황</div>
        <div className="mt10 mb10">
          <div className="ml20 mr10 float-left rectangle color-MD"></div>
          <span>MD</span>
        </div>
        <div className="mt10 mb10">
          <div className="ml20 mr10 float-left rectangle color-MAD"></div>
          <span>MAD</span>
        </div>
        <div className="mt10 mb10">
          <div className="ml20 mr10 float-left rectangle color-ITD"></div>
          <span>ITD</span>
        </div>
        <div className="mt10 mb10">
          <div className="ml20 mr10 float-left rectangle color-SSD"></div>
          <span>SSD</span>
        </div>
        <div className="mt10 mb10">
          <div className="ml20 mr10 float-left rectangle color-RD"></div>
          <span>RD</span>
        </div>
        <div className="mt10 mb10">
          <div className="ml20 mr10 float-left rectangle color-IDAM"></div>
          <span>IDAM</span>
        </div>
    </div>
  );
}
  