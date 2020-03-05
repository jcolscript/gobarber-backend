import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt-nodejs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        cellphone: Sequelize.BIGINT,
        password: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async user => {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8));
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id' });
  }

  checkPassword(password) {
    return bcrypt.compareSync(password, this.password);
  }
}

export default User;
