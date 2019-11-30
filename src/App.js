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
    console.log(this.props.hintsY)
    var rows =  this.props.board.map( (item, row) => { // item is the actual object in board and row is the row index
      var entry = item.map((_, j) => {
        return (
          <td key = {row * this.props.width + j}>{this.renderCell(row * this.props.width + j)}</td>
        )
      })
      return (
        <tr key = {row}><td>{this.props.hintsY[row]}</td>{entry}</tr>
      )
    })

    

    return (
      <div>
        <div className="board-row">
          
        </div>
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
        height : height,
        width : width,
        board : board,
        actual : actual,
        hintsX: [],
        hintsY : []
      }
  }

  getrowHints()
  {
    var hintsY = []
    for (let row = 0; row < this.state.height; row++)
    {
      var rowHints = []
      var streak = 0
      for (let col = 0; col < this.state.width; col++)
      {
        if (this.state.actual[row][col] == 'Full')
        {
          streak += 1
        }
        else
        {
          if (streak > 0)
          {
            rowHints.push(streak)
            streak = 0
          }
        }
      }
      if (streak > 0)
      {
        rowHints.push(streak)
      }
      console.log("rowHints: " + rowHints)
      hintsY.push(rowHints)
    }
    console.log(hintsY)
    this.setState({ hintsY })
  }

  getcolHints()
  {
    var hints = []
    var actual = this.state.actual.slice(0)
    for (let i = 0; i < this.state.height; i++)
    {
      var colHints = []
      var streak = 0
      for (let j = 0; j < this.state.width; j++)
      {
        if (actual[j][i] == 'Full')
        {
          streak += 1
        }
        else
        {
          if (streak > 0)
          {
            colHints.push(streak)
            streak = 0
          }
        }
      }
      hints.push(colHints)
    }
    this.setState({ hintsX : hints })
  }

  generateBoard(seed)
  {
    if (seed === undefined)
    {
      seed = '' + new Date().getTime()
    }
    var rng = seedrandom(seed)
    var actual = this.state.actual.slice(0)
    for (let row = 0; row < this.state.height; row++)
    {
      for (let col = 0; col < this.state.width; col++)
      {
        var rando = Math.ceil(rng() * 2)
        actual[row][col] =  (rando == 2) ? 'Full' : 'Empty' 
      }
    }
    this.setState({actual})
  }

  handleClick = (_event,i) =>
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

  componentDidMount()
  {
    this.generateBoard()
    this.getcolHints()
    this.getrowHints()
  }
  
  render()
  {
    return (
      <div>
        <div>
          <p>Check out <a href="http://liouh.com/picross">the picross source</a> for what I'm going to completely revamp because Mr. Henry Liou is too busy</p>
          <p>Check out my progress on this on my <a href="https://github.com/dhrumilp15/picross">github</a> </p>
        </div>
        <div>
          
        </div>
        <Board
          board = {this.state.board}
          height = {this.state.height}
          width = {this.state.width}
          onClick = {(event,i) => this.handleClick(event,i)}
          onContextMenu = {(event,i) => this.handleContextMenu(event, i)}
          actual = {this.state.actual}
          hintsX  = {this.state.hintsX}
          hintsY  = {this.state.hintsY}
        />
      </div>
    )
  }
}

export default App;
