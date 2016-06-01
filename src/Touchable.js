'use strict';

import React, { PropTypes } from 'react';
import {findHandler} from './driver';
import ReactNative from 'react-native';
const {
  View,
} = ReactNative;

const ACTION_TYPES = {
  onPress: 'press',
  onPressIn: 'pressIn',
  onPressOut: 'pressOut',
  onLongPress: 'longPress'
};

function createTouchableClass(className) {
  return React.createClass({
    displayName: 'Cycle' + className,
    propTypes: {
      selector: PropTypes.string.isRequired,
      payload: PropTypes.any
    },
    setNativeProps(props) {
      this._touchable.setNativeProps(props);
    },
    render() {
      const TouchableClass = React[className];
      const {selector, ...props} = this.props;

      // find all defined touch handlers
      const handlers = Object.keys(ACTION_TYPES)
        .map(name => [name, findHandler(ACTION_TYPES[name], selector)])
        .filter(([_, handler]) => !!handler)
        .reduce((memo, [name, handler]) => {
          // pass payload to event handler if defined
          memo[name] = () => handler(this.props.payload || null);
          return memo;
        }, {});


      return (
        <TouchableClass
          ref={view => this._touchable = view}
          {...handlers}
        >
          <View {...props}>
            {this.props.children}
          </View>
        </TouchableClass>
      );
    }
  });
}

export default {
  TouchableOpacity: createTouchableClass('TouchableOpacity'),
  TouchableWithoutFeedback: createTouchableClass('TouchableWithoutFeedback'),
  TouchableHighlight: createTouchableClass('TouchableHighlight'),
  TouchableNativeFeedback: createTouchableClass('TouchableNativeFeedback')
};
