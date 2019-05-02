import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  const winningSquareStyle = {
    backgroundColor: "red"
  };
  return (
    <button
      className="square"
      onClick={() => {
        props.onClick();
      }}
      style={props.winner ? winningSquareStyle : null}
    >
      {props.value}
    </button>
  );
}

function Toggle(props) {
  return (
    <button
      onClick={() => {
        props.onClick();
      }}
    >
      List display order (Ascending/Descending)
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        id={i}
        winner={this.props.winners.includes(i) ? true : false}
      />
    );
  }

  render() {
    var rows = [];
    let squares = [];
    for (let i = 0; i < 3; i++) {
      for (let k = 0; k < 3; k++) {
        squares.push(this.renderSquare(k + i * 3));
      }
      rows.push(<div className="board-row">{squares}</div>);
      squares = [];
    }
    return <div>{rows}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      sIsNext: true,
      stepNumber: 0,
      row: [0],
      col: [0],
      isSelected: Array(9).fill(false),
      isListAscending: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      col: this.state.col.concat((i % 3) + 1),
      row: this.state.row.concat(Math.floor(i / 3) + 1),
      isSelected: Array(9).fill(false)
    });
  }

  jumpTo(step) {
    const isSelectedArr = this.state.isSelected.slice();
    isSelectedArr[step] = true;
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
      isSelected: isSelectedArr
    });
  }

  handleToggle() {
    this.setState({
      isListAscending: this.state.isListAscending ? false : true
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move
        ? "Go to move #" +
          move +
          "(" +
          this.state.row[move] +
          "," +
          this.state.col[move] +
          ")"
        : "Go to game start";

      return (
        <li key={move}>
          <button
            id={move}
            className={
              this.state.isSelected[move]
                ? "btn btn-primary btn-sm m-2"
                : "btn btn-secondary m-2 btn-sm"
            }
            onClick={() => {
              this.jumpTo(move);
            }}
          >
            {desc}
          </button>
        </li>
      );
    });
    if (!this.state.isListAscending) {
      moves.sort((a, b) => {
        return b.key - a.key;
      });
    }

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            winners={winner ? winner.winningSquares : []}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <Toggle onClick={() => this.handleToggle()} />
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        squares: squares[a],
        winningSquares: lines[i]
      };
    }
  }
  return null;
}
