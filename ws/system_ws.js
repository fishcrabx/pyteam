const system_service = require('../services/system_service');
const user_service = require('../services/user_service');
const result = require('../utils/result');
const config = require('../config');

// 查询所有项目，推送给页面
exports.getSystems = async (socket) => {
    //console.log('start systems');
    // 查询所有系统
    let systems = await system_service.findAll({});
    socket.emit('data', result(config.wsCode.SYSTEMS, null, {systems: systems}));
};

// 创建系统
exports.createSystem = async (io, socket_users, name, intro, userId) => {
    await system_service.create(name, intro, userId);
    emitSystemMessage(io, socket_users, userId);
};

exports.getSystemFiles = async (socket, id, userId) => {
    let system = await system_service.findSystemById(id);
    let files = await system_service.findAttachments(id);
    let user = await user_service.findById(userId);
    let isAdmin = 0;
    if (config.admins.indexOf(user.username) !== -1) {
        isAdmin = 1;
    }
    socket.emit('data', result(config.wsCode.SYSTEM_FILES, null, {system: system, files: files, isAdmin: isAdmin}));
};

exports.updateSystemFiles = async (io, socket_users, systemId) => {
    let system = await system_service.findSystemById(systemId);
    let files = await system_service.findAttachments(systemId);
    let allUser = await user_service.findAll({});
    for (index in socket_users) {
        let isAdmin = 0;
        for (let i = 0; i < allUser.length; i++) {
            if (allUser[i].id == socket_users[index].userId) {
                if (config.admins.indexOf(allUser[i].username) !== -1) {
                    isAdmin = 1;
                }
                break;
            }
        }
        io.to(socket_users[index].socketId).emit('data', result(config.wsCode.SYSTEM_FILES, null, {
            system: system,
            files: files,
            isAdmin: isAdmin
        }));
    }
};

// 更新系统
exports.updateProject = async (io, socket_users, id, name, intro, userId) => {
    await system_service.update(id, name, intro);
    emitSystemMessage(io, socket_users, userId);
};

async function emitSystemMessage(io, socket_users, userId) {
    let waitEmitUsers = socket_users;
    let systems = await system_service.findAll({});
    for (index in waitEmitUsers) {
        io.to(waitEmitUsers[index].socketId).emit('data', result(config.wsCode.SYSTEMS, null, {systems: systems}));
    }
}