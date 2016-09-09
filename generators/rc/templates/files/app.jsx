import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import RC from './src/index';
class APP extends Component {
  render() {
    return <div>
      <h1>从来前端组件测试：</h1>
      <RC ref="obj"/>
    </div>;
  }
};

//## init App
function initApp() {
  var container = document.getElementById('J_page');
  ReactDOM.render(
    <APP/>,
    container
  );
}
initApp();

