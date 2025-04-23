module.exports = (sequelize, DataTypes) => {
    const Subjects = sequelize.define("Subjects", {
        subjectId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        subjectNumber: {
            type:DataTypes.INTEGER,
            allowNull: false
        }
    });
    Subjects.associate = (models) => {
        Subjects.hasMany(models.Sessions, { foreignKey: 'subjectId' })
    }
    return Subjects;
};