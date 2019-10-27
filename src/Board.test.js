import Board from './Board.js';
import { mount, shallow } from 'enzyme';
import { expect , assert } from 'chai';
import sinon from 'sinon';
import React from 'react';

describe("Given a Board created with squares", () => {
    let board;
    const onClick = sinon.spy();
    const squares = ["X", "O", "", "O", "X", "", "X", "O", ""];

    beforeAll(() => {
        board = mount(<Board squares={squares} onClick={onClick} />);
    });

    it("it should have 9 squares", () => {
        assert.equal(board.find('button').length, 9);
    });

    it("each square should have a callback function", () => {
        board.find('button')
            .forEach(node => node.simulate('click'));
        expect(onClick).to.have.property('callCount', 9);
    });

    it("each square should have its value passed from the board", () => {
        let mountedSquareValues = board.find('button')
                                    .map(node => node.text());
        assert.deepEqual(mountedSquareValues, squares);
    });
});

describe("When renderSquares is called", () => {
    const onClick = sinon.spy();
    const squares = ["X", "O", "", "O", "X", "", "X", "O", ""];

    it("a Square should be returned", () => {
        let board = new Board({
            squares: squares,
            onClick: onClick
        });
        let square = shallow(board.renderSquare(3));
        let squareButton = square.find('button');

        expect(squareButton.text()).to.equal("O");
    })
});