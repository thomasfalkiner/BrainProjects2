module.exports = (sequelize, DataTypes) => {
    const Runs = sequelize.define("Runs", {
        runId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoincrement: true
        },
        run: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
        emoface: {
            type: DataTypes.BLOB
        },
        flair:{
            type:DataTypes.BLOB
        },
        t1w: {
            type: DataTypes.BLOB
        }
    });
    Runs.associate = (models) => {
        Runs.belongsTo(models.Sessions, { foreignKey: 'sessionId' })
    }
    return Runs;
};