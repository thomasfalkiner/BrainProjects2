module.exports = (sequelize, DataTypes) => {
    const Subjects = sequelize.define("Subjects", {
        subjectId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        studyId: {
            type:DataTypes.INTEGER,
            foreignKey: true
        }
    });
    Subjects.associate = (models) => {
        Subjects.hasMany(models.Sessions, { foreignKey: 'subjectId' })
        Subjects.belongsTo(models.Study, { foreignKey: 'studyId'} )
    }
    return Subjects;
};