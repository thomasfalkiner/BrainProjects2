module.exports = (sequelize, DataTypes) => {
    const Runs = sequelize.define("Runs", {
        runId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        runNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sessionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    });
    Runs.associate = (models) => {
        Runs.hasMany(models.NData, { foreignKey: 'runId'})
        Runs.belongsTo(models.Sessions, { foreignKey: 'sessionId' })
    }
    return Runs;
};