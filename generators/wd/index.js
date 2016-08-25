'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    let done = this.async();
    this.log(yosay(
      '从来前端生成器'
    ));

    let prompts = [{
      type: 'input',
      name: 'name',
      message: '项目名',
      default: this.appname
    },{
      type: 'input',
      name: 'desc',
      message: '项目描述',,
      default: this.appname
    }];

    this.prompt(prompts, config => {
      this._config = config;
      this.log(config);
      done();
    });
  },

  writing: {
    app: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        this._config
      );
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
    }
  },

  install: function () {
    this.installDependencies();
  }
});
