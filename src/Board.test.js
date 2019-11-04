import { assert } from 'chai';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import React from 'react';
import Board from './Board.js';

describe("When renderSquare is called", () => {
    const onClick = sinon.spy();
    const squares = [
        "X", "O", "", 
        "O", "X", "", 
        "X", "O", ""
    ];

    it("a Square should be returned", () => {
        let board = new Board({
            squares: squares,
            onClick: onClick
        });
        let square = shallow(board.renderSquare(3));
        let squareButton = square.find('button');

        assert.equal(squareButton.text(), "O");

        squareButton.simulate('click');
        assert.equal(onClick.getCall(0).args[0], 3);
    });
});

describe("Given a Board created with squares", () => {
    let board;
    const onClick = sinon.spy();
    const squares = [
        "X", "O", "", 
        "O", "X", "", 
        "X", "O", ""
    ];

    beforeAll(() => {
        board = mount(<Board squares={squares} onClick={onClick} />);
    });

    it("each square should have the correct value", () => {
        let mountedSquareValues = 
            board.find('button')
                .map(node => node.text());
        assert.deepEqual(mountedSquareValues, squares);
    });

    it("each square should have the right onClick behaviour", () => {
        let squareButtons = board.find('button');
        assert.equal(squareButtons.length, squares.length);
        squareButtons.forEach((button, index) => {
            button.simulate('click');
            assert.equal(onClick.getCall(index).args[0], index);
        });
    });
});