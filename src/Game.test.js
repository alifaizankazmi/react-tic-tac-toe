import { assert, expect } from 'chai';
import { mount } from 'enzyme';

import React from 'react';
import Game from './Game.js';

const getStatusText = gameComponent => 
    gameComponent.find('.game-info div').text();

const getSquaresAsText = gameComponent =>
    JSON.stringify(gameComponent.find('Square')
        .map(square => square.text()));

const clickSquare = (game, buttonIndex) =>
    game.find('button')
        .at(buttonIndex)
        .simulate('click');

describe("Given a Game", () => {
    let game;

    beforeAll(() => {
        game = mount(<Game />);
    });

    it("it should have an empty board", () => {
        assert.equal(getSquaresAsText(game),
            JSON.stringify(Array(9).fill("")));
    });

    it("it should have the right status", () => {
        assert.equal(getStatusText(game),
            "Next player: X");
    });

    it("it should have an empty moves list", () => {
        assert.equal(
            JSON.stringify(game.find('.game-info li button')
                .map(button => button.text())),
            JSON.stringify(["Go to game start"]));
    });
});

describe("Given the user clicks a square in a new Game", () => {
    let game;

    beforeEach(() => {
        game = mount(<Game />);
        clickSquare(game, 0);
    });

    it("the square should get an X", () => {
        assert.equal(getSquaresAsText(game),
            JSON.stringify(['X'].concat(Array(8).fill(""))));
    });

    it("the status label should get updated", () => {
        assert.equal(getStatusText(game),
            "Next player: O");
    });

    it("the moves list should get updated", () => {
        assert.equal(
            JSON.stringify(game.find('.game-info li button')
                .map(button => button.text())),
            JSON.stringify([
                "Go to game start",
                "Go to move #1 (1, 1)"]));
    });

    it("the current move should be rendered in bold", () => {
        let lastMoveButton = 
            game.find('.game-info li button')
                .at(1);
        assert.equal(lastMoveButton.props().style.fontWeight, 
            'bold');
    });

    it("the first move should not be rendered in bold", () => {
        let firstMoveButton = 
            game.find('.game-info li button')
                .at(0);
        assert.equal(firstMoveButton.props().style.fontWeight, 
            'normal');
    });
});

describe("Given the user clicks on a used square", () => {
    let game;

    let assertExpectedState = game => {
        assert.equal(getSquaresAsText(game),
            JSON.stringify(['X']
                .concat(Array(8).fill(""))));
        assert.equal(getStatusText(game),
        "Next player: O");
        assert.equal(
            JSON.stringify(game.find('.game-info li button')
                .map(button => button.text())),
            JSON.stringify([
                "Go to game start",
                "Go to move #1 (1, 1)"]));
    };

    beforeAll(() => {
        game = mount(<Game />);
        clickSquare(game, 0);
    });

    it("the click should have no effect", () => {
        assertExpectedState(game);

        clickSquare(game, 0);

        assertExpectedState(game);
    });
});


describe("Given the user clicks on the second square", () => {
    let game;

    beforeEach(() => {
        game = mount(<Game />);
        clickSquare(game, 0);
        clickSquare(game, 1);
    });

    it("the square should have an O", () => {
        assert.equal(getSquaresAsText(game),
            JSON.stringify(['X', 'O'].
                concat(Array(7).fill(""))));
    });

    it("the status label should get updated", () => {
        assert.equal(getStatusText(game),
            "Next player: X");
    });

    it("the moves list should get updated", () => {
        assert.equal(
            JSON.stringify(game.find('.game-info li button')
                .map(button => button.text())),
            JSON.stringify([
                "Go to game start",
                "Go to move #1 (1, 1)",
                "Go to move #2 (2, 1)"]));
    });
});

describe("Given a game with two moves", () => {
    const game = mount(<Game />);
    clickSquare(game, 0);
    clickSquare(game, 5);

    describe("When the user chooses to go back one move", () => {
        beforeAll(() => {
            game.find('.game-info li button')
                .at(1)
                .simulate('click')
        });

        it("the game board and status should go back one move", () => {
            assert.equal(getSquaresAsText(game),
            JSON.stringify(['X']
                .concat(Array(8).fill(""))));
            assert.equal(getStatusText(game),
                "Next player: O");
        });

        it("the moves list count should stay the same", () => {
            assert.equal(
                JSON.stringify(game.find('.game-info li button')
                    .map(button => button.text())),
                JSON.stringify([
                    "Go to game start",
                    "Go to move #1 (1, 1)",
                    "Go to move #2 (3, 2)"]));
        });

        it("the selected move should be rendered in bold", () => {
            let selectedMoveButton = 
                game.find('.game-info li button')
                    .at(1);
            assert.equal(
                selectedMoveButton.props().style.fontWeight, 
                'bold');            
        });

        it("the latest move should not be rendered in bold", () => {
            let lastMoveButton =
                game.find('.game-info li button')
                    .at(2);
            assert.equal(
                lastMoveButton.props().style.fontWeight,
                'normal');
        });
    });

    describe("When the user chooses to go forward one move", () => {
        beforeAll(() => {
            game.find('.game-info li button')
                .at(1)
                .simulate('click');
            game.find('.game-info li button')
                .at(2)
                .simulate('click');
        });

        it("the game board and status should go forward one move", () => {
            assert.equal(getSquaresAsText(game),
                JSON.stringify([
                    'X', '', '' ,
                    '' , '', 'O',
                    '' , '', ''
                ]));
            assert.equal(getStatusText(game),
                "Next player: X");
        });

        it("the moves list should not get updated", () => {
            assert.equal(
                JSON.stringify(game.find('.game-info li button')
                    .map(button => button.text())),
                JSON.stringify([
                    "Go to game start",
                    "Go to move #1 (1, 1)",
                    "Go to move #2 (3, 2)"]));
        });
    });

    describe("When the user chooses to go to game start", () => {
        beforeAll(() => {
            game.find('.game-info li button')
                .at(1)
                .simulate('click');
            game.find('.game-info li button')
                .at(0)
                .simulate('click');
        });

        it("the game board and status should go back to game start", () => {
            assert.equal(getSquaresAsText(game),
                JSON.stringify(Array(9).fill("")));
            assert.equal(getStatusText(game),
                "Next player: X");
        });

        it("the moves list should not get updated", () => {
            assert.equal(
                JSON.stringify(game.find('.game-info li button')
                    .map(button => button.text())),
                JSON.stringify([
                    "Go to game start",
                    "Go to move #1 (1, 1)",
                    "Go to move #2 (3, 2)"]));
        });        
    });
});

describe("When the X user makes a winning move", () => {
    let game;
    
    let assertWinningState = game => {
        assert.equal(getSquaresAsText(game),
            JSON.stringify([
                'X', 'O', 'O',
                '' , 'X', '' ,
                '' , '' , 'X']));
        assert.equal(getStatusText(game),
            "Winner: X");
    };

    beforeAll(() => {
        game = mount(<Game />);
        clickSquare(game, 0);
        clickSquare(game, 1);
        clickSquare(game, 4);
        clickSquare(game, 2);
        clickSquare(game, 8);
    });

    it("then the status should get updated", () => {
        assert.equal(getStatusText(game),
            "Winner: X");        
    });

    it("then no more moves should be possible", () => {
        assertWinningState(game);

        clickSquare(game, 6);

        assertWinningState(game);
    });
});

describe("When the O user makes a winning move", () => {
    let game;
    
    let assertWinningState = game => {
        assert.equal(getSquaresAsText(game),
            JSON.stringify([
                'X', '' , 'O',
                '' , 'O', '' ,
                'O', 'X', 'X']));
        assert.equal(getStatusText(game),
            "Winner: O");
    };

    beforeAll(() => {
        game = mount(<Game />);
        clickSquare(game, 0);
        clickSquare(game, 2);
        clickSquare(game, 8);
        clickSquare(game, 4);
        clickSquare(game, 7);
        clickSquare(game, 6);
    });

    it("then the status should get updated", () => {
        assert.equal(getStatusText(game),
            "Winner: O");        
    });

    it("then no more moves should be possible", () => {
        assertWinningState(game);

        clickSquare(game, 5);

        assertWinningState(game);
    });
});

describe("When no user makes a winning move", () => {
    let game;

    let assertDrawState = game => {
        assert.equal(getSquaresAsText(game),
            JSON.stringify([
                'X', 'O', 'X',
                'X', 'O', 'X' ,
                'O', 'X', 'O']));
        assert.equal(getStatusText(game),
            "Next player: O");
        };

        beforeEach(() => {
        game = mount(<Game />);
        clickSquare(game, 0);
        clickSquare(game, 4);
        clickSquare(game, 3);
        clickSquare(game, 6);
        clickSquare(game, 2);
        clickSquare(game, 1);
        clickSquare(game, 7);
        clickSquare(game, 8);
        clickSquare(game, 5);
    });

    it("then the status should get updated", () => {
        assert.equal(getStatusText(game),
            "Next player: O");        
    });

    it("then no more moves should be possible", () => {
        assertDrawState(game);

        clickSquare(game, 5);

        assertDrawState(game);
    });
});