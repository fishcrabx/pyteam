const models = require('../models/models');
const {sequelize} = require('../models/db');
const user_service = require('./user_service');
const config = require('../config');
const fs = require('fs');

let system_model = models.system_model;

exports.create = async (name, intro, userId) => {
    // 开户事务，失败回滚
    await sequelize.transaction({autocommit: true}, async (t) => {
        let user = await user_service.findById(userId);
        let project = await system_model.create(
            {
                name: name,
                intro: intro,
                creator: userId
            },
            {transaction: t}
        );
    });
};

// -------------------------------------------------------------------------------------------------
exports.findAll = async (opt) => {
    opt.include = [{all: true}];
    return await system_model.findAll(opt);
};

exports.addAttachment = async (systemId, fileCount = 1) => {
    let system = await system_model.findOne({include: [{all: true}], where: {id: systemId}});
    console.log(system);
    await sequelize.transaction({autocommit: true}, async (t) => {
        await system_model.update(
            {
                docCount: system.docCount + fileCount
            },
            {where: {id: systemId}, transaction: t}
        );
    });
};
exports.findSystemById = async (systemId) => {
    return await system_model.findOne({include: [{all: true}], where: {id: systemId}});
};

exports.findAttachments = async (systemId) => {
    // 查找任务的附件
    if (fs.existsSync(`${config.attachment_dir}/system/${systemId}`)) {
        let attachmentFiles = await fs.readdirSync(`${config.attachment_dir}/system/${systemId}`);
        let files = [];
        for (let item in attachmentFiles) {
            if (!attachmentFiles[item].startsWith("del-")) {
                files.push(attachmentFiles[item]);
            }
        }
        return await files.map((item) => {
            return {
                name: item,
                ext: item.split('.').pop(),
                url: `/attachments/system/${systemId}/${item}`
            };
        });
    } else {
        return [];
    }
};

exports.update = async (id, name, intro) => {
    // 开户事务，失败回滚
    await sequelize.transaction({autocommit: true}, async (t) => {
        await system_model.update(
            {
                name: name,
                intro: intro
            },
            {where: {id: id}, transaction: t}
        );
    });
};

exports.deleteById = async (id) => {
    await sequelize.transaction({autocommit: true}, async (t) => {
        // 删除系统
        await system_model.destroy({where: {id: id}, transaction: t});
    });
};
