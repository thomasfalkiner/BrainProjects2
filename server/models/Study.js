module.exports = (sequelize, DataTypes) => {
    const Study = sequelize.define("Study", {
        studyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        description: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        emptyroom: {
            type:DataTypes.BLOB
        },
        participants: {
            type: DataTypes.BLOB
        },
        derivatives: {
            type: DataTypes.BLOB
        }

    });
    Study.associate = (models) => {
        Study.hasMany(models.Subjects, { foreignKey: 'subjectId' })
    }
    return Study;
};