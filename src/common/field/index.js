import React from 'react';
import builder from 'focus-core/component/builder';
import type from 'focus-core/component/types';
// Mixins
const valueBehaviour = require('./mixin/value-behaviour');
const validationBehaviour = require('./mixin/validation-behaviour');
// Components
const builtInComponents = require('./mixin/built-in-components');

/**
 * Mixin for the field helper.
 * @type {Object}
 */
const FieldMixin = {
    /** @inheriteDoc */
    mixins: [valueBehaviour, validationBehaviour, builtInComponents],
    /** @inheriteDoc */
    getDefaultProps() {
        return {
            isEdit: true,
            type: 'text'
        };
    },
    /** @inheritdoc */
    propTypes: {
        /**
        * Edition mode of the field.
        * @type {Boolean}
        */
        isEdit: type('bool'),
        /**
        * HTML input type.
        * @type {String}
        */
        type: type('string'),
        /**
        * Field name.
        * @type {string}
        */
        name: type('string'),
        value: type(['string', 'number'])
    },
    /** @inheritdoc */
    componentWillReceiveProps(newProps) {
        this.setState({value: newProps.value, error: newProps.error, values: newProps.values});
    },
    /**
    * Get the css class of the field component.
    */
    _className() {
        const stateClass = this.state.error ? 'is-invalid' : '';
        return `mdl-grid ${stateClass}`;
    },
    /** @inheritdoc */
    render() {
        const {error} = this.state;
        const {FieldComponent, InputLabelComponent, domain, codeResolver, searcher, keyResolver, querySearcher, isRequired, values, hasLabel, isEdit} = this.props;
        const isCustomComponent = FieldComponent || InputLabelComponent;
        const {autocomplete, autocompleteSelect, autocompleteText, label, input, select, display} = this;
        return (
            <div className='mdl-grid' data-domain={domain} data-focus='field' data-mode={isEdit ? 'edit' : 'consult'} data-required={isRequired} data-valid={!error}>
                {isCustomComponent && this._renderFieldComponent()}
                {!isCustomComponent && hasLabel && label()}
                {!isCustomComponent &&
                    <div className ={`${this._getContentGridClassName()}`} data-focus='field-value-container'>
                        {codeResolver && searcher ? autocomplete() : keyResolver && querySearcher ? autocompleteSelect() : querySearcher ? autocompleteText() : isEdit ? (values ? select() : input()) : display()}
                    </div>
                }
            </div>
        );
    }
};
module.exports = builder(FieldMixin);
