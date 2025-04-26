module.exports = (sequelize, DataTypes) => {
    const NData = sequelize.define("NData", {
        sessionId: {
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
        },
        runNumber: {
            type: DataTypes.INTEGER
        }
    });
    NData.associate = (models) => {
        NData.belongsTo(models.Sessions, {foreignKey: 'sessionId'})
    }
    return NData;
};