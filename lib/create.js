const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const Inquirer = require('inquirer');
const ora = require('ora');
const api = require('../api/interface/index');
const cwd = process.cwd();

// 下载模板
const util = require('util');
const downloadGitRepo = require('download-git-repo');

// UI
const figlet = require('figlet');

class Creator {
    constructor(projectName, options) {
        this.projectName = projectName;
        this.options = options;
    }
    async showWelcome() {
        console.log(`
            \r\n
            ${chalk.green.bold(
            figlet.textSync("Success", {
                font: "Isometric2",
                horizontalLayout: "default",
                verticalLayout: "default",
                width: 150,
                whitespaceBreak: false,
            }, function (err, data) {
                if (err) {
                    console.log('Something went wrong...');
                    console.dir(err);
                    return;
                }
                console.log(data)
                console.log(data.replace(/\n/g, '\n ')); // 在每行后面添加一个空格
            })
        )}
        `)
    }
    // 创建
    async create() {
        console.log('create project:', this.projectName);
        const isOverwrite = await this.handleDirectory();
        if (!isOverwrite) return;

        await this.getCollectRepo();
    }
    // 处理是否有相同目录
    async handleDirectory() {
        const targetDirectory = path.join(cwd, this.projectName);
        // 如果目录中存在了需要创建的目录
        if (fs.existsSync(targetDirectory)) {
            if (this.options.force) {
                await fs.remove(targetDirectory);
            } else {
                let { isOverwrite } = await new Inquirer.prompt([
                    {
                        name: 'isOverwrite',
                        type: 'list',
                        message: '是否强制覆盖已存在的同名目录？',
                        choices: [
                            {
                                name: '覆盖',
                                value: true
                            },
                            {
                                name: '不覆盖',
                                value: false
                            }
                        ]
                    }
                ]);
                if (isOverwrite) {
                    await fs.remove(targetDirectory);
                } else {
                    console.log(chalk.red.bold('不覆盖文件夹，创建终止'));
                    return false;
                }
            }
        };
        return true;
    }
    // 获取可拉取的仓库列表
    async getCollectRepo() {
        const loading = ora('正在获取模版信息...');
        loading.start();
        const { data: list } = await api.getRepos({ per_page: 100 });
        loading.succeed();
        const collectTemplateNameList = list.filter(item => item.topics.includes('template')).map(item => item.name);
        console.log('collectTemplateNameList:', collectTemplateNameList)

        // 选择模板
        let { choiceTemplateName } = await new Inquirer.prompt([
            {
                name: 'choiceTemplateName',
                type: 'list',
                message: '请选择模版',
                choices: collectTemplateNameList
            }
        ]);

        // 下载模板
        this.downloadTemplate(choiceTemplateName);
    }
    // 下载仓库
    async downloadTemplate(choiceTemplateName) {
        this.downloadGitRepo = util.promisify(downloadGitRepo);
        const templateUrl = `yuuuuuyu/${choiceTemplateName}`;
        const loading = ora('正在拉取模版...');
        loading.start();
        await this.downloadGitRepo(templateUrl, path.join(cwd, this.projectName));
        loading.succeed();

        // 拉取完成后提示如何操作
        this.showTemplateHelp();
    }
    // 模版使用提示
    async showTemplateHelp() {
        console.log(`\r\nSuccessfully created project ${chalk.cyan(this.projectName)}`);
        console.log(`\r\n  cd ${chalk.cyan(this.projectName)}\r\n`);
        console.log("  pnpm install");
        console.log("  pnpm dev\r\n");
        await this.showWelcome()
    }


}

module.exports = async function (projectName, options) {
    const creator = new Creator(projectName, options);
    await creator.create();
}
