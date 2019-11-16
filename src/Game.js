import React from 'react';
import Board from './Board.js';

export default class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null)
                }
            ],
            stepNumber: 0,
            xIsNext: true,
            isSortAsc: true
        };
    }

    handleClick(i) {
        const history = this.state.history
            .slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares,
                    location: this.getDisplayLocation(i)
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    getDisplayLocation(index) {
        return "(" + 
          (index % 3 + 1) + ", " + 
          (Math.floor(index / 3) + 1) + 
        ")";
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        let moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + ' ' + step.location :
                'Go to game start';
            return (
                <li key={move}>
                    <button 
                        style={this.state.stepNumber === move? 
                            {fontWeight: 'bold'}: {fontWeight: 'normal'}} 
                        onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            );
        });

        if(!this.state.isSortAsc) {
            moves = moves.reverse();
        }

        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else if(!current.squares.includes(null)) {
            status = "Game ended in a draw";
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                        winner={winner}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <label className="switch">
                        <input type="checkbox" 
                            checked={this.state.isSortAsc}
                            onChange={() => this.setState({isSortAsc: !this.state.isSortAsc})}
                        />
                        <span className="slider round"></span>
                    </label>
                    <label className="switch-text">
                        {this.state.isSortAsc? "Ascending": "Descending"}
                    </label>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

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
        if (squares[a] && 
            squares[a] === squares[b] && 
            squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}