import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={`square ${props.highlight ? 'focus' : ''}`} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Board ({ squares, highlightSquares, onClick }) {
  return (
    <div>
      {[0,1,2].map(a => {
        const row_index = a * 3;
        return (
          <div className="board-row">
            {squares.slice(row_index, row_index + 3).map((square, index) => (
              <Square value={square} 
          
                highlight={highlightSquares.includes(index + row_index)} 
                onClick={() => onClick(index + row_index)} />
            ))}
          </div>
        )
      })}
    </div>
  );
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        squareChanged: null,
        highlightSquares:[]
      }],
      descendingMoves: true,
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat({
        squares: squares,
        squareChanged: i,
        highlightSquares: [i]
      }),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleToggle() {
    this.setState({
      descendingMoves: !this.state.descendingMoves
    })
  }

  displayMoves(moves){
    return this.state.descendingMoves ? moves.reverse() : moves
  }

  handleGameEnd(){
    this.setState({})
  }

  render() {

    const history =  this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      console.log(step, move)
      const desc = move ?
        'Go to move #' + move + determineCoordinates(step.squareChanged) :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })


    let status;
    if (winner) {
      status = 'Winner: ' + winner.symbol;
      current.highlightSquares = winner.winningSquares;
    } else {
      !current.squares.includes(null) 
        ? status = 'It is a draw!' 
        : status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            highlightSquares={current.highlightSquares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.displayMoves(moves)}</ol>
          <button onClick={() => this.handleToggle()}>{'toggle'}</button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        symbol: squares[a], 
        winningSquares: lines[i]
      };
    }
  }
  return null;
}

function determineCoordinates(squareChanged) {
  const coordinatesList = [
    '(0,2)',
    '(1,2)',
    '(2,2)',
    '(0,1)',
    '(1,1)',
    '(2,1)',
    '(0,0)',
    '(1,0)',
    '(2,0)',
  ]
  return coordinatesList[squareChanged]
}