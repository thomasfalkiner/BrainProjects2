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
        sessionNumber: {
            type:DataTypes.INTEGER,
            allowNull: false
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false
        },
        coordsystem: {
            type: DataTypes.JSON
        },
        photo: {
            type: DataTypes.BLOB
        },
        headshape: {
            type: DataTypes.BLOB
        },
        scans: {
            type: DataTypes.BLOB
        }
    });
    Sessions.associate = (models) => {
        Sessions.hasMany(models.NData, { foreignKey: 'sessionId' })
        Sessions.belongsTo(models.Subjects, { foreignKey:'subjectId' })
    }
    return Sessions;
};