module.exports = (sequelize, Sequelize) => {

    const msgdb = sequelize.define("chat", {

        id: {

            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement:true

        },

        msg: {

            type: Sequelize.STRING(60),
            allowNull:false
        }

    },
    {timestamps:false}
    );


    return msgdb;

};
