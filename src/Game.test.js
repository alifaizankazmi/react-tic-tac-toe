import Game from './Game.js';
import { assert } from 'chai';
import { mount } from 'enzyme';
import React from 'react';

const getStatusText = gameComponent => 
    gameComponent.find('.game-info div').text();

const getMovesList = gameComponent =>
    gameComponent.find('.game-info li button');

const getSquares = gameComponent =>
    gameComponent.find('Square')
        .map(square => square.text());

const clickBox = (game, buttonIndex) =>
    game.find('button')
        .at(buttonIndex)
        .simulate('click');

describe("Given a Game", () => {
    let game;

    beforeAll(() => {
        game = new Game({});
    });

    it("it should have the expected default state", () => {
        assert.equal(game.state.stepNumber, 0);
        assert.equal(game.state.xIsNext, true);

        assert.equal(game.state.history.length, 1);
        assert.deepEqual(game.state.history[0].squares, 
            Array(9).fill(null));
    });
});

describe("Given the user clicks a box in a new Game", () => {
    let game;

    beforeEach(() => {
        game = mount(<Game />);
    });

    it("the first box that gets clicked should get an X", () => {
        clickBox(game, 0);

        assert.equal(game.state().stepNumber, 1);
        assert.isFalse(game.state().xIsNext);
        assert.equal(game.state().history.length, 2);
        assert.deepEqual(game.state().history[0].squares,
            Array(9).fill(null));
        assert.deepEqual(game.state().history[1].squares,
            ['X'].concat(Array(8).fill(null)));
    });

    it("clicking the same box should have no effect", () => {
       clickBox(game, 0); 

       assert.equal(game.state().stepNumber, 1);
       assert.isFalse(game.state().xIsNext);
       assert.equal(game.state().history.length, 2);
       assert.deepEqual(game.state().history[0].squares,
           Array(9).fill(null));
       assert.deepEqual(game.state().history[1].squares,
           ['X'].concat(Array(8).fill(null)));
        
        clickBox(game, 0);

        assert.equal(game.state().stepNumber, 1);
        assert.isFalse(game.state().xIsNext);
        assert.equal(game.state().history.length, 2);
        assert.deepEqual(game.state().history[0].squares,
            Array(9).fill(null));
        assert.deepEqual(game.state().history[1].squares,
            ['X'].concat(Array(8).fill(null)));
    });

    it("the second box that gets clicked should get an O", () => {
        clickBox(game, 0);
        clickBox(game, 1);

        assert.equal(game.state().stepNumber, 2);
        assert.isTrue(game.state().xIsNext);
        assert.equal(game.state().history.length, 3);
        assert.deepEqual(game.state().history[1].squares,
            ['X'].concat(Array(8).fill(null)));
        assert.deepEqual(game.state().history[2].squares,
            ['X', 'O'].concat(Array(7).fill(null)));
    });

    it("the status should get updated with each move", () => {
        assert.equal(getStatusText(game), "Next player: X");

        clickBox(game, 0);

        assert.equal(getStatusText(game), "Next player: O");

        clickBox(game, 1);

        assert.equal(getStatusText(game), "Next player: X");
    });

    it("the moves list should get updated with each move", () => {
        assert.equal(getMovesList(game).length, 1);
        assert.equal(getMovesList(game).text(), "Go to game start");

        clickBox(game, 0);

        assert.equal(getMovesList(game).length, 2);
        assert.equal(getMovesList(game).last().text(), "Go to move #1");

        clickBox(game, 1);

        assert.equal(getMovesList(game).length, 3);
        assert.equal(getMovesList(game).last().text(), "Go to move #2");
    });
});

describe("Given the user clicks on the first button in the move list", () => {
    let game;

    beforeEach(() => {
        game = mount(<Game />);
    });

    it("the game should go back to its initial state", () => {
        clickBox(game, 0);
        clickBox(game, 1);

        getMovesList(game).find('button')
            .first()
            .simulate('click');

        assert.equal(game.state().stepNumber, 0);
        assert.equal(game.state().xIsNext, true);

        /* Move history should NOT be cleared */
        assert.equal(game.state().history.length, 3);

        assert.equal(getStatusText(game), "Next player: X");
        assert.equal(JSON.stringify(getSquares(game)), JSON.stringify(Array(9).fill("")));
    });
});

describe("Given the user clicks on the second button in the move list", () => {
    let game;

    beforeEach(() => {
        game = mount(<Game />);
    });

    it("the game should go back to the first move", () => {
        clickBox(game, 0);
        clickBox(game, 1);

        getMovesList(game).find('button')
            .at(1)
            .simulate('click');

        assert.equal(game.state().stepNumber, 1);
        assert.equal(game.state().xIsNext, false);

        /* Move history should NOT be cleared */
        assert.equal(game.state().history.length, 3);

        assert.equal(getStatusText(game), "Next player: O");

        assert.equal(JSON.stringify(getSquares(game)), 
            JSON.stringify(["X"].concat(Array(8).fill(""))));
    });
});

describe("When the game reaches a winning state", () => {
    let game;

    beforeAll(() => {
        game = mount(<Game />);
    });

    it("the game should end and should not respond to any further moves", () => {
        clickBox(game, 0);
        clickBox(game, 1);
        clickBox(game, 4);
        clickBox(game, 2);
        clickBox(game, 8);

        assert.equal(getStatusText(game), "Winner: X");

        let lastStepNumber = game.state().stepNumber;
        let squaresInWonState = getSquares(game);

        clickBox(game, 5);
        
        assert.equal(game.state().stepNumber, lastStepNumber);
        assert.equal(JSON.stringify(getSquares(game)), 
            JSON.stringify(squaresInWonState)
        );
    });
});