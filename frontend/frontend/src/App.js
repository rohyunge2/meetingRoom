import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import CalendarComp from "./components/meeting/calendarComp"

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/meeting/reservation" component={CalendarComp}></Route>
          <Route path="/" component={CalendarComp}></Route>
        </Switch>
      </BrowserRouter>
    );
  }
}
