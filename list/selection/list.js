/**@jsx*/
var builder =  require('focus').component.builder;
var React = require('react');
var Line = require('./line').mixin;
var Button = require('../../common/button/action').component;
var uuid= require('uuid');
var type = require('focus').component.types;
var InfiniteScrollMixin = require('./infinite-scroll').mixin;

var listMixin = {
    mixins: [InfiniteScrollMixin],
    /**
     * Display name.
     */
    displayName: "selection-list",

    /**
     * Default properties for the list.
     * @returns {{isSelection: boolean}}
     */
    getDefaultProps: function getLineDefaultProps(){
        return {
            isSelection : true,
            isAllSelected : false,
            isLoading: false,
            hasMoreData: false,
            operationList: [],
            isManualFetch: false
        };
    },

    /**
     * list property validation.
     * @type {Object}
     */
    propTypes:{
        data: type('array'),
        isSelection: type('bool'),
        isAllSelected: type('bool'),
        onSelection: type('func'),
        onLineClick: type('func'),
        isLoading: type('bool'),
        loader: type('func'),
        FetchNextPage: type('func'),
        operationList: type('array'),
        isManualFetch: type('bool')
    },

    /**
     * Return selected items in the list.
     */
    getSelectedItems: function getListSelectedItems(){
        var selected = [];
        for(var i= 1; i< this.props.data.length + 1;i++){
            var lineName = "line" + i;
            var lineValue = this.refs[lineName].getValue();
            if(lineValue.isSelected){
                selected.push(lineValue.item);
            }
        }
        return selected;
    },
    fetchNextPage: function fetchNextPage(page){
        if(!this.props.hasMoreData){
            return;
        }
        if(this.props.fetchNextPage){
            return this.props.fetchNextPage(page);
        }
    },

    /**
     * handle manual fetch.
     * @param event
     */
    _handleShowMore: function handleShowMore(event){
        this.nextPage++;
        this.fetchNextPage(this.nextPage);
    },

    /**
     * Render lines of the list.
     * @returns {*}
     */
    _renderLines: function renderLines(){
        var lineCount = 1;
        var LineComponent = this.props.lineComponent || React.createClass(Line);
        return this.props.data.map((line)=>{
            return React.createElement(LineComponent,{
                key : line.id || uuid.v4(),
                data: line,
                ref: "line" + lineCount++,
                isSelection: this.props.isSelection,
                isSelected: this.props.isAllSelected,
                onSelection: this.props.onSelection,
                onLineClick: this.props.onLineClick,
                operationList: this.props.operationList
            });
        });
    },
    _renderLoading: function(){
        if(this.props.isLoading){
            if(this.props.loader){
                return this.props.loader();
            }
            return (
                <li className="sl-loading">Loading ...</li>
            );
        }
    },

    _renderManualFetch: function renderManualFetch(){
        if(this.props.isManualFetch && this.props.hasMoreData){
            var style = {className: "primary"};
            return (
                <li className="sl-button">
                    <Button label="list.selection.button.showMore"
                        type="button"
                        handleOnClick={this._handleShowMore}
                        style={style}/>
                </li>
            );
        }
    },

    /**
     * Render the list.
     * @returns {XML}
     */
    render: function renderList(){
        return(
            <ul className="selection-list">
              {this._renderLines()}
              {this._renderLoading()}
              {this._renderManualFetch()}
            </ul>
        );
    }
}

module.exports = builder(listMixin);