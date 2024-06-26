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
    .name('beeboat1-cli')
    // 配置命令格式
    .usage(`<command> [option]`)
    .version(version)
    .description('A CLI for initializing Vue 3 projects');

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
                message: 'Enter your project name:',
                default: projectName,
            },
        ]).then((answers) => {
            createModel(projectName, options);

            // const projectPath = `${process.cwd()}/${answers.projectName}`;
            // console.log(answers)
            // fs.ensureDirSync(projectPath);
            // const vueCommand = spawn('vue', ['create', answers.projectName], { cwd: projectPath });
            // vueCommand.stdout.on('data', (data) => {
            //     console.log(data.toString());
            // });
            // vueCommand.stderr.on('data', (data) => {
            //     console.error(data.toString());
            // });
            // vueCommand.on('close', (code) => {
            //     console.log(code, '====')
            //     if (code !== 0) {
            //         console.error(`Failed to create project, exit code: ${code}`);
            //     } else {
            //         console.log('Project created successfully!');
            //     }
            // });
        });
    });

program.parse(process.argv);
