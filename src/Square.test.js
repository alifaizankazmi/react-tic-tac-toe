import { assert } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Square from './Square.js';

describe("Given a square with props", () => {
    let square;
    const onButtonClick = sinon.spy();

    beforeAll(() => {
        square = shallow(Square({
            onClick: onButtonClick, 
            value: "X"
        }));
    });

    it("it should consist of a single button", () => {
        assert.equal(square.find('button').length, 1);
    });

    it("it should have an onClick function", () => {
        square.find('button').simulate('click');
        assert(onButtonClick.calledOnce);
    });

    it("it should have a text value equal to its value prop", () => {
        assert.equal(square.find('button').text(), "X");
    });
});