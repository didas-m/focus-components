import InputDate from '../';
const {Component} = React;
import moment from 'moment';

global.componentHandler = {
    upgradeElement: sinon.stub(),
    downgradeElements: sinon.stub()
};

describe('The input date', () => {
    describe('when mounted with a valid value', () => {
        const now = new Date().toISOString();
        let renderedTest;
        const onChangeSpy = sinon.spy();
        before(() => {
            renderedTest = TestUtils.renderIntoDocument(<InputDate onChange={onChangeSpy} value={now} />);
        });

        it('should hold the provided initial value', () => {
            expect(moment(renderedTest.getValue()).isSame(now, 'day')).to.be.true;
        });

        it('should display the provided date in the dropdown', () => {
            expect(moment(renderedTest.state.dropDownDate.toISOString()).isSame(now, 'day')).to.be.true;
        });
    });

    describe('when mounted with a null value', () => {
        let renderedTest;
        const onChangeSpy = sinon.spy();
        before(() => {
            renderedTest = TestUtils.renderIntoDocument(<InputDate onChange={onChangeSpy} value={null} />);
        });

        it('should give a null value', () => {
            expect(renderedTest.getValue()).to.be.null;
        });

        it('should display today\'s date in the dropdown', () => {
            expect(moment().isSame(renderedTest.state.dropDownDate, 'day')).to.be.true;
        });

    });

    describe('when mounted with an invalid value', () => {
        let renderedTest;
        const onChangeSpy = sinon.spy();
        before(() => {
            renderedTest = TestUtils.renderIntoDocument(<InputDate onChange={onChangeSpy} value='invalid date' />);
        });

        it('should give a null value', () => {
            expect(renderedTest.getValue()).to.be.null;
        });

        it('should display today\'s date in the dropdown', () => {
            expect(moment().isSame(renderedTest.state.dropDownDate, 'day')).to.be.true;
        });
    });

    describe('when the value given as a prop changes', () => {
        let now = new Date().toISOString();
        let renderedTest;
        const onChangeSpy = sinon.spy();
        class TestComponent extends Component {
            constructor() {
                super();
                this.state = {
                    value: now
                };
            }

            render() {
                return <InputDate onChange={onChangeSpy} ref='date' value={now} />;
            }
        }

        before(() => {
            renderedTest = TestUtils.renderIntoDocument(<TestComponent />);
            now = new Date().toISOString();
            renderedTest.setState({value: now});
        });

        it('should change its internal value', () => {
            expect(moment(renderedTest.refs.date.getValue()).isSame(now, 'day')).to.be.true;
        });
    });

    describe('when the user clears the input', () => {
        const now = new Date().toISOString();
        let renderedTest;
        const onChangeSpy = sinon.spy();
        before(() => {
            renderedTest = TestUtils.renderIntoDocument(<InputDate onChange={onChangeSpy} value={now} />);
            const input = ReactDOM.findDOMNode(renderedTest.refs.input.refs.htmlInput);
            TestUtils.Simulate.change(input, {target: {value: ''}});
        });
        it('should give a null value', () => {
            expect(renderedTest.getValue()).to.be.null;
        });
    });

    describe('when the user enters a valid input', () => {
        const validDateString = '02/03/10';
        let renderedTest;
        class TestComponent extends Component {
            constructor() {
                super();
                this.state = {
                    value: null
                };
            }

            onDateChange = (value) => {
                this.setState({value});
            }

            render = () => {
                return <InputDate onChange={this.onDateChange} ref='date' value={this.state.value} />;
            }
        }
        before(() => {
            renderedTest = TestUtils.renderIntoDocument(<TestComponent />);
            const input = ReactDOM.findDOMNode(renderedTest.refs.date.refs.input.refs.htmlInput);
            TestUtils.Simulate.change(input, {target: {value: validDateString}});
            TestUtils.Simulate.blur(input);
        });
        it('should give the provided value', () => {
            expect(moment(renderedTest.refs.date.getValue()).isSame(moment(Date.parse(validDateString)).toISOString())).to.be.true;
        });
    });

    describe('when the user enters an invalid input', () => {
        const invalidDateString = 'Lol invalid';
        let renderedTest;
        class TestComponent extends Component {
            constructor() {
                super();
                this.state = {
                    value: null
                };
            }

            onDateChange = (value) => {
                this.setState({value});
            }

            render = () => {
                return <InputDate onChange={this.onDateChange} ref='date' value={this.state.value} />;
            }
        }
        before(() => {
            renderedTest = TestUtils.renderIntoDocument(<TestComponent />);
            const input = ReactDOM.findDOMNode(renderedTest.refs.date.refs.input.refs.htmlInput);
            TestUtils.Simulate.change(input, {target: {value: invalidDateString}});
        });
        it('should give a null value', () => {
            expect(renderedTest.refs.date.getValue()).to.be.null;
        });
        it('but still let the invalid value in the input', () => {
            expect(ReactDOM.findDOMNode(renderedTest.refs.date.refs.input.refs.htmlInput).value).to.equal(invalidDateString);
        });
    });
});
