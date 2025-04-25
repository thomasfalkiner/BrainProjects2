module.exports = (sequelize, DataTypes) => {
    const NData = sequelize.define("NData", {
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
            type:DataTypes.BLOB('long')
        }
    });
    NData.associate = (models) => {
        NData.belongsTo(models.Runs, {foreignKey: 'runId'})
    }
    return NData;
};