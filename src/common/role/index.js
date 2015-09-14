let React = require('react');
let builder = require('focusjs').component.builder;
let user = require('focusjs').user;
let intersection = require('lodash/array/intersection');
let isArray = require('lodash/lang/isArray');
let type = require('focusjs').component.types;

/**
 * Mixin button.
 * @type {Object}
 */
var roleMixin = {
    propTypes:{
      hasOne: type('array'),
      hasAll:type('array')
    },
    render() {
      let userRoles = user.getRoles();
      if(isArray(this.props.hasAll) && intersection(userRoles, this.props.hasAll).length === this.props.hasAll.length){
        return this.props.children;
      } else if(isArray(this.props.hasOne) && intersection(userRoles, this.props.hasOne).length > 0){
        return this.props.children;
      }
      return null;

    }
};

module.exports = builder(roleMixin);
