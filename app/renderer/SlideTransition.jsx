import React, { Component, CSSTransitionGroup } from 'react';
import PropTypes from 'prop-types';

export default class SlideTransition extends Component {
  static propTypes = {
    depth: PropTypes.number.isRequired,
    name: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.array,
  };

  getDefaultProps() {
    return {
      name: 'slider',
    };
  }

  getInitialState() {
    return {
      direction: 'right',
    };
  }

  componentWillReceiveProps(newProps) {
    const direction = newProps.depth > this.props.depth ? 'right' : 'left';
    this.setState({
      direction,
    });
  }

  render() {
    const { name, depth } = this.props;
    const outerProps = {
      className: `${name}-outer-wrapper ${this.props.className}`,
    };
    const transProps = {
      component: 'div',
      transitionName: `${name}-${this.state.direction}`,
      className: `${name}-transition-group`,
    };
    const innerProps = {
      ref: 'inner',
      key: depth,
      className: `${name}-inner-wrapper`,
    };

    return (
      <div {...this.props} {...outerProps}>
        <CSSTransitionGroup {...transProps}>
          <div {...innerProps}>
            {this.props.children}
          </div>
        </CSSTransitionGroup>
      </div>
    );
  }
}
