import { Sequelize, Model, DataTypes, Op } from "sequelize";

const sequelize = new Sequelize("sqlite:memory");

class Book extends Model {}

Book.init(
  {
    title: { type: DataTypes.STRING },
    author: { type: DataTypes.STRING },
    pages: { type: DataTypes.INTEGER },
    id: { type: DataTypes.INTEGER, primaryKey: true},
  },
  {
    sequelize,
    modelName: "Books",
    timestamps: false,
  }
);

class Tags extends Model {}

Tags.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tags: { type: DataTypes.ARRAY(DataTypes.DECIMAL) },
  },
  {
    sequelize,
    modelName: "Tags",
    timestamps: false,
  }
);

Book.hasMany(Tags);
Tags.belongsTo(Book);

async function main() {
  await sequelize.sync({ force: true });

  let book1 = await Book.create(
    {
      title: "Robinson Crusoe",
      author: "Daniel Defoe",
      pages: 300,
      Tags: {tags: ["adventure", "history"]},
      id: 0,
    },
    { include: [Tags] }
  );
  let book2 = await Book.create(
    {
      title: "The Unbearable Lightness of Being",
      author: "Milan Kundera",
      pages: 250,
      Tags: {tags: ["philosophical", "novel"]},
      id: 1,
    },
    { include: [Tags] }
  );
  let book3 = await Book.create(
    {
      title: "Nausea",
      author: "Jean-Paul Sartre",
      pages: 120,
      Tags: {tags: ["philosophical", "existentialism", "novel"]},
      id: 2,
    },
    { include: [Tags] }
  );

  let allBooks = await Book.findAll({include: Tags});
  allBooks.forEach((x) => console.log(x.toJSON()));

  sequelize.close();
}

main();
