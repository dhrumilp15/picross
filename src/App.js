import React from 'react';
import logo from './logo.svg';
import './App.css';

class Cell extends React.Component
{  
  // constructor(props)
  // {
  //   super(props);
  //   this.state =
  //   {
  //     type : 0,
  //     bgColor: 'gray'
  //   }
  // }
  render()
  {
    return (
      <button
        className="cell"
        onClick = {() => this.props.onClick()}
        value = {this.props.value}
        >
          {this.props.value}
        </button>
    )
  }
}

class Board extends React.Component
{
  renderCell(i)
  {
    let column = i % this.props.width
    let row = Math.floor(i/this.props.height)
    return (
      <Cell
        value = {this.props.board[row][column]}
        onClick = {() => this.props.onClick(i)}
      />
    )
  }

  render()
  {
    var rows =  this.props.board.map( (item, row) => { // item is the actual object in board and row is the row index
      console.log(row)
      var entry = item.map((element, j) => {
        console.log(j)
        return (
          <td key = {row * this.props.width + j}>{this.renderCell(row * this.props.width + j)}</td>
        )
      })
      return (
        <tr key = {row}>{entry}</tr>
      )
    })
    return (
      <div>
        <table className="table">
          <tbody>
            {rows}
          </tbody>
        </table>
        </div>
    )
  }
}

class App extends React.Component
{
  
  constructor(props)
  {
      super(props)
      
      var width = 10
      var height = 10
      var board = []
      for (let i = 0; i < height; i++)
      {
        let row = []
        for(let j = 0; j < width; j++)
        {
          row.push(null)
        }
        board[i] = row
      };

      this.state = 
      {
        height,
        width,
        board, 
      }
  }

  handleClick(i)
  {

    // map(int, list)
    var column = i % this.state.width
    var row = Math.floor(i/this.state.height)
    var board = this.state.board.slice(0)
    board[row][column] = i
    this.setState({
      board
    })
  }
  
  render()
  {
    return (
      <Board
        board = {this.state.board}
        height = {this.state.height}
        width = {this.state.width}
        onClick = {i => this.handleClick(i)}
      />
    )
  }
}

export default App;
