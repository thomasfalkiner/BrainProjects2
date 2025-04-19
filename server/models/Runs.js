module.exports = (sequelize, DataTypes) => {
    const Runs = sequelize.define("Runs", {
        runId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        sessionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        rest: {
            type: DataTypes.BLOB
        },
        noise: {
            type: DataTypes.BLOB
        },
        spatt: {
            type: DataTypes.BLOB
        },
        crt: {
            type: DataTypes.BLOB
        },
        emoface: {
            type: DataTypes.BLOB
        }

    });
    Runs.associate = (models) => {
        Runs.belongsTo(models.Sessions, { foreignKey: 'sessionId' })
    }
    return Runs;
};