import React from 'react';

export default function Square(props) {
    return (
        <button 
            className={props.isWinner? "square winner": "square"} 
            onClick={props.onClick}>
            {props.value}
        </button>
    );
}