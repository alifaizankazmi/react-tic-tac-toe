import Square from './Square.js';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

describe("Given a square with props", () => {
    let square;
    const onButtonClick = sinon.spy();

    beforeAll(() => {
        square = Square({onClick: onButtonClick, value: "X"});
    });

    it("it should be of type button", () => {
        expect(square.type).to.equal("button")
    });

    it("it should have an onClick function", () => {
        const wrapper = shallow(square);
        wrapper.find('button').simulate('click');
        expect(onButtonClick).to.have.property('callCount', 1);
    });

    it("it should have a text value equal to its value prop", () => {
        const wrapper = shallow(square);
        expect(wrapper.find('button').text()).to.equal("X");
    });
});