const {Sequelize, sequelize} = require('./db');

const system_model = sequelize.define(
    'system_model',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            comment: '系统名称'
        },
        intro: {
            type: Sequelize.STRING,
            allowNull: true,
            comment: '系统简介'
        },
        docCount: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '文档数'
        }
    },
    {
        tableName: 'system',
        timestamps: true // 不默认增加 createdAt 字段
    }
);

// department_model.addHook('beforeCreate', (obj, options) => {
//   obj.createdAt = Date.now();
// });

// department_model.addHook('beforeUpdate', (obj, options) => {
//   obj.updatedAt = Date.now();
// });

module.exports = system_model;
