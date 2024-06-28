#!/usr/bin/env node
const { program } = require('commander');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const { spawn } = require('child_process');

// 获取当前版本号
const version = require('../package.json').version;
const createModel = require('../lib/create');

program
    // 配置脚手架名称
    .name('beeboat-cli')
    // 配置命令格式
    .usage(`<command> [option]`)
    .version(version)
    .description('A CLI For Initializing Vue3 Projects');

program
    .command('create <project-name>')
    .description('Initialize a new Vue 3 project')
    .option('-f, --force', 'overwrite target directory if it exists')
    .action((projectName, options) => {
        // 引入create模块，并传入参数
        inquirer.prompt([
            {
                type: 'input',
                name: 'projectName',
                message: '输入项目名称:',
                default: projectName,
            },
        ]).then((answers) => {
            createModel(answers.projectName, options);
        });
    });

program.parse(process.argv);
