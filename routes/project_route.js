const project_service = require('../services/project_service');
const task_service = require('../services/task_service');
const user_service = require('../services/user_service');
const config = require('../config') ;

exports.index = async (ctx) => {
    await ctx.render('project', {
        page_title: '项目'
    });
};

exports.detail = async (ctx) => {
    const id = ctx.params.id;
    let showSetBtn = 0;
    let project = await project_service.findById(id);
    let users = await user_service.findAll({});
    let joinUsers = await user_service.findUsersByProjectId(id);
    if (config.admins.indexOf(ctx.session.user.username) !== -1) {
        showSetBtn = 1;
    }
    if (ctx.session.user.id === project.creator) {
        showSetBtn = 1;
    }
    await ctx.render('project', {
        page_title: '项目',
        project: project,
        joinUsers: joinUsers,
        showSetBtn: showSetBtn,
        users: users
    });
};
