module.exports = (sequelize, DataTypes) => {
    const MEG = sequelize.define("MEG", {
        runId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true
        },
        taskType: {
            type:DataTypes.STRING
        },
        filename: {
            type: DataTypes.STRING
        },
        filetype: {
            type: DataTypes.STRING
        },
        filepath: {
            type:DataTypes.STRING
        },
        rawdata: {
            type:DataTypes.BLOB
        }
    });
    MEG.associate = (models) => {
        MEG.belongsTo(models.Runs, {foreignKey: 'runId'})
    }
    return MEG;
};