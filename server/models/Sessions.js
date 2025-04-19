module.exports = (sequelize, DataTypes) => {
    const Sessions = sequelize.define("Sessions", {
        sessionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        subjectId: {
            type: DataTypes.INTEGER,
            allowNull: false,            
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    Sessions.associate = (models) => {
        Sessions.hasMany(models.Runs, { foreignKey: 'sessionId' })
        Sessions.belongsTo(models.Subjects, { foreignKey:'subjectId' })
    }
    return Sessions;
};