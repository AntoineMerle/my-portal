import React, { Component } from 'react';
import axios from 'axios';

var myUrl="http://localhost:8001/home";

class Calendar extends Component {
  constructor(props){
    super(props);
    this.state = {
        result: null,
      };
  }
  getResult(){
    axios.get(myUrl)
      .then(function(response){
        this.setState({
          result: response
        });
      })
  }
  componentDidMount() {
    this.getResult();
  }
  render() {
    return (
      <div>please sign</div>
    );
  }
}

export default Calendar;
