module.exports = (sequelize, DataTypes) => {
    const CRT = sequelize.define("CRT", {
        run_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        headshape: {
            type: DataTypes.BLOB
        },
        bold_nifti: {
            type:DataTypes.BLOB
        },
        bold_json: {
            type:DataTypes.JSON
        },
        events: {
            type: DataTypes.BLOB
        }
    });
    return CRT;
};