'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    let done = this.async();
    this.log(yosay(
      '从来前端NodeJS生成器'
    ));

    let prompts = [{
      type: 'input',
      name: 'name',
      message: '仓库名',
      default: this.appname
    },{
      type: 'input',
      name: 'desc',
      message: '仓库描述',
      default: this.appname
    }];

    this.prompt(prompts, config => {
      this._config = config;
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
      this.fs.copyTpl(
        this.templatePath('_readme'),
        this.destinationPath('README.md'),
        this._config
      );
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('files/**/*'),
        this.destinationPath('./')
      );
      this.fs.copy(
        this.templatePath('files/**/.*'),
        this.destinationPath('./')
      );
    }
  },
});
