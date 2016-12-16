import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import React, { Component } from 'react';


// products will be presented by react-bootstrap-table
var events = [{
      id: 1,
      name: "OktoberFest",
      date : "28/08/2017",
      place: "Moulin rouge"
  },{
      id: 2,
      name: "Soirée off",
      date : "28/08/2017",
      place: "Stade de france"
  }];
// It's a data format example.
function priceFormatter(cell, row){
  return '<i class="glyphicon glyphicon-usd"></i> ' + cell;
}

class Calendar extends Component {
  render() {
    return (
      <div className="Calendar basic-div">
      <h1 className="basic-title">Agenda ANEO</h1>
      <BootstrapTable data={events} striped={true} hover={true}>
          <TableHeaderColumn dataField="id" isKey={true} dataAlign="center" dataSort={true}></TableHeaderColumn>
          <TableHeaderColumn dataField="name" dataSort={true}>Titre</TableHeaderColumn>
          <TableHeaderColumn dataField="date" dataFormat={priceFormatter}>Quand</TableHeaderColumn>
          <TableHeaderColumn dataField="place" dataFormat={priceFormatter}>Ou</TableHeaderColumn>
      </BootstrapTable>
      </div>
    );
  }
}

export default Calendar;
