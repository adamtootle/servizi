import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, makeSelectable } from 'material-ui/List';

const SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
  return class WrappedSelectableList extends Component {
    static propTypes = {
      children: PropTypes.node.isRequired,
      defaultValue: PropTypes.number,
    };

    componentWillMount() {
      this.setState({
        selectedIndex: this.props.defaultValue,
      });
    }

    handleRequestChange = (event, index) => {
      this.setState({
        selectedIndex: index,
      });
    };

    render() {
      return (
        <ComposedComponent
          value={this.state.selectedIndex}
          onChange={this.handleRequestChange}
        >
          {this.props.children}
        </ComposedComponent>
      );
    }
  };
}

export default wrapState(SelectableList);
