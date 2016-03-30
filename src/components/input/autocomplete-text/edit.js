import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import ComponentBaseBehaviour from '../../../behaviours/component-base';
import MDBehaviour from '../../../behaviours/material';

@MDBehaviour('materialInput')
@ComponentBaseBehaviour
class AutocompleteTextEdit extends Component {
    static defaultProps = {
        placeholder: 'Search here...',
        showAtFocus: false,
        emptyShowAll: false
    };

    static propTypes = {
        querySearcher: PropTypes.func.isRequired,
        value: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        error: PropTypes.string,
        placeholder: PropTypes.string,
        showAtFocus: PropTypes.boolean,
        emptyShowAll: PropTypes.boolean
    };

    state = {
        inputValue: this.props.value,
        suggestions: [],
        hasSuggestions: false,
        error: this.props.error,
        hasFocus: false
    };

    // Returns the state's inputValue
    getValue = () =>  {
        const {inputValue} = this.state;
        if(inputValue !== undefined) {
            return inputValue;
        }
        else {
            return null;
        }
    }

    // Get the defined props' querySearch and return the object given by the promise
    // Sets the hasSuggestions' state if the given object has a none empty array
    _querySearcher = value => {
        const {querySearcher} = this.props;
        const {hasSuggestions} = this.state;

        querySearcher(value).then(({data, totalCount}) => {
            if(totalCount > 0) {
                this.setState({hasSuggestions: true, suggestions: data, error: ''});
            }
            else if(totalCount === 0 && this.props.error == undefined) {
                this.setState({error: 'No data founded'});
                this.refs.materialInput.classList.add('is-invalid');
            }
            else if(totalCount === 0 && this.props.error != '') {
                this.setState({error: this.props.error});
                this.refs.materialInput.classList.add('is-invalid');
            }
            else if(totalCount === 1 && data[0].key == 'ERR') {
                //Here temporary solution to give the opportunity for the dev to have a error list dropdown message
                this.setState({hasSuggestions: true, suggestions: data, error: ''});
            }
        }).catch(err => {
            this.setState({error: JSON.stringify(err)});
            this.refs.materialInput.classList.add('is-invalid');
        });
    }

    // Sets the state's inputValue when the user is typing
    onQueryChange = ({target: {value}}) => {
        this.setState({inputValue: value});
        if(value.trim() == '') {
            this.setState({hasSuggestions: false});
        }
        else {
            this._querySearcher(value);
        }
    }

    onResultClick(value) {
        this.refs.inputText.value = value;
        this.setState({inputValue: value, hasSuggestions: false, suggestions: []});
        return value;
    }

    // Returns an html list whith the Suggestions
    renderSuggestions = () => {
        const {suggestions} = this.state;
        const allSuggestions = suggestions.map(({key, label}, index) => <li ref={`suggestion${index}`} key={key} onMouseDown={() => {this.onResultClick(label)}} data-focus='option' >{label}</li>);
        return(
            <ul ref='suggestions' data-focus='options'>
                {allSuggestions}
            </ul>
        );
    }

    toggleHasFocus = e => {
        const {hasSuggestions, hasFocus} = this.state;
        const {showAtFocus, emptyShowAll} = this.props;
        this.setState({hasFocus: !this.state.hasFocus});
        if(hasSuggestions && !showAtFocus && hasFocus === false) {
            this.setState({hasSuggestions: false});
        }
        if(!hasSuggestions && e.target.value.trim() === '' && emptyShowAll && hasFocus === false) {
            // Doing a global search here
            this._querySearcher('');
        }
        return true;
    }

    //Maybe give the option for the floating label
    render() {
        const {inputValue, hasSuggestions, error, hasFocus, ...otherProps} = this.state;
        const {placeholder, showAtFocus, emptyShowAll} = this.props
        return(
            <div data-focus='autocompleteText'>
                <div className='mdl-textfield mdl-js-textfield' ref='materialInput'>
                    <input onFocus={this.toggleHasFocus} onBlur={this.toggleHasFocus} className='mdl-textfield__input' type='text' value={inputValue} ref='inputText' onChange={::this.onQueryChange} showAtFocus={showAtFocus} emptyShowAll={emptyShowAll} {...otherProps} />
                    <label className="mdl-textfield__label">{placeholder}</label>
                    <span className="mdl-textfield__error" ref='errorMessage'>{error}</span>
                </div>
                {hasSuggestions && hasFocus &&
                    this.renderSuggestions()
                }
            </div>
        );
    }
}

export default AutocompleteTextEdit;
