import React from 'react';
import Square from './Square.js';

export default class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        let squareRows = [];

        for (let col = 0; col < 3; col++) {
            let squares = [];
            for (let row = 0; row < 3; row++) {
                const squareIndex = col * 3 + row;
                squares.push(
                    this.renderSquare(squareIndex));
            }
            squareRows.push(
                <div className="board-row" key={col}>
                    {squares}
                </div>);
        }

        return (
            <div>
                {squareRows}
            </div>
        );
    }
}