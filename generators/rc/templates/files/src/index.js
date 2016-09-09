import { Component, PropTypes } from 'react';

export default class RCSchemaEditor extends Component{
  static displayName = 'RCSchemaEditor';

  render() {
    let style = {
      height: 500,
      backgroundColor: '#f40',
    };
    return <div className="rc-cc" style={style}>
      Hello world...
    </div>;
  }
}
