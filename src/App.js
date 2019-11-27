import React from 'react';
import './App.css';
var seedrandom = require('seedrandom');

class Cell extends React.Component
{  
  render()
  {
    switch (this.props.typecell) {
      case 'Empty':
        return (
          <button
            className="cell-empty"
            onClick = {(e) => this.props.onClick(e)}
            onContextMenu = {(e) => this.props.onContextMenu(e)}
            value = {this.props.value}  
            >
          </button>)
      case 'Incorrect':
          return (
            <button
              className="cell-empty"
              onClick = {(e) => this.props.onClick(e)}
              onContextMenu = {(e) => this.props.onContextMenu(e)}   
              value = {this.props.value}  
              >
                X
            </button>)
      case 'Full':
          return (
            <button
              className="cell-full"
              onClick = {(e) => this.props.onClick(e)}
              onContextMenu = {(e) => this.props.onContextMenu(e)}
              value = {this.props.value}  
              >
            </button>)
      default:
        return (
          <button            
            className="cell"
            onClick = {(e) => this.props.onClick(e)}
            onContextMenu = {(e) => this.props.onContextMenu(e)}
            value = {this.props.value}  
            >
          </button>)
    }
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
        value = {this.props.board[row][column][0]}
        onClick = {(e) => this.props.onClick(e,i)}
        onContextMenu = {(e) => this.props.onContextMenu(e,i)}
        typecell = {this.props.board[row][column][1]}
      />
    )
  }

  render()
  {
    var rows =  this.props.board.map( (item, row) => { // item is the actual object in board and row is the row index
      var entry = item.map((element, j) => {
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
      var actual = []
      for (let i = 0; i < height; i++)
      {
        let row = []
        let actualrow = []
        for(let j = 0; j < width; j++)
        {
          row.push([null, ''])
          actualrow.push(null)
        }
        board[i] = row
        actual[i] = actualrow
      };

      this.state = 
      {
        height,
        width,
        board,
        actual,
      }
  }

  handleClick = (event,i) =>
  {
    // Intention is to fill cell
    // alert('left click')
    
    var column = i % this.state.width
    var row = Math.floor(i/this.state.height)
    var board = this.state.board.slice(0)
    
    if (board[row][column][1] != '') return
    board[row][column][0] = i
    if (this.state.actual[row][column] == 'Full')
    {
      board[row][column][1] = 'Full'
    } else {
      board[row][column][1] = 'Incorrect'
    }
    
    this.setState({
      board
    })
  }

  handleContextMenu = (event, i) =>
  {
    //Intention is to declare cell empty
    // alert('right click')
    event.preventDefault()
    var column = i % this.state.width 
    var row = Math.floor(i/this.state.height)
    var board = this.state.board.slice(0)
    if (board[row][column][1] != '') return
    board[row][column][0] = i
    if (this.state.actual[row][column] == 'Empty')
    {
      board[row][column][1] = 'Empty'
    } else {
      board[row][column][1] = 'Incorrect'
    }
    this.setState({
      board
    })
  }

  generateBoard(seed)
  {
    if (seed === undefined)
    {
      seed = 'hello'
    }
    var rng = seedrandom(seed)
    var actual = this.state.actual.slice(0)
    for (let row = 0; row < this.state.height; row++)
    {
      for (let col = 0; col < this.state.width; col++)
      {
        console.log(rng())
        var rando = Math.ceil(rng() * 2)
        console.log(rando)
        actual[row][col] =  (rando == 2) ? 'Full' : 'Empty' 
      }
    }
    this.setState({actual})
  }

  componentDidMount()
  {
    //Extract seed from db
    this.generateBoard()
  }
  
  render()
  {
    return (
      <div>
        <div>
          <p>Check out <a href="http://liouh.com/picross">the picross source</a> for what I'm going to completely revamp because Mr. Henry Liou is too busy</p>
        </div>
        <Board
          board = {this.state.board}
          height = {this.state.height}
          width = {this.state.width}
          onClick = {(event,i) => this.handleClick(event,i)}
          onContextMenu = {(event,i) => this.handleContextMenu(event, i)}
        />
      </div>
    )
  }
}

export default App;
