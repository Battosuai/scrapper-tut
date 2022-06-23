import axios from "axios";
import { load } from "cheerio";
import mysql from "mysql";

const connectionString = process.env.DATABASE_URL || "";
const connection = mysql.createConnection(connectionString);
connection.connect();

const getCharacterPageNames = async () => {
  const url =
    "https://throneofglass.fandom.com/wiki/Category:Kingdom_of_Ash_characters";
  const { data } = await axios.get(url);
  const $ = load(data);
  const categories = $("ul.category-page__members-for-char");

  const characterPageNames = [];
  for (let i = 0; i < categories.length; i++) {
    const ul = categories[i];
    const characterLis = $(ul).find("li.category-page__member");
    for (let j = 0; j < characterLis.length; j++) {
      const li = characterLis[j];
      //   console.log(li);
      const path =
        $(li).find("a.category-page__member-link").attr("href") || "";
      const name = path.replace("/wiki/", "");
      characterPageNames.push(name);
    }
  }
  return characterPageNames;
};

const getCharacterInfo = async (characterName: string) => {
  const url = `https://throneofglass.fandom.com/wiki/${characterName}`;
  const { data } = await axios.get(url);
  const $ = load(data);
  let name = $('h2[data-source="name"]').text();
  const species = $(
    'div[data-source="species"] > div.pi-data-value.pi-font'
  ).text();
  const image = $(".image.image-thumbnail > img").attr("src");
  if (!name) {
    name = characterName.replace("_", " ");
  }
  const characterInfo = {
    name,
    species,
    image,
  };
  return characterInfo;
};

const loadCharacters = async () => {
  const characterNames = await getCharacterPageNames();
  const characterInfoPromises = characterNames.map((characterName) =>
    getCharacterInfo(characterName)
  );
  const characters = await Promise.all(characterInfoPromises);
  const values = characters.map((character, index) => [
    index + 1,
    character.name,
    character.species,
    character.image,
  ]);
  console.log(characters);
  const sql = "Insert into Characters (id, name, species, image) values ?";
  connection.query(sql, [values], (err) => {
    if (err) console.log("error", err);
    console.log("data saved in db");
  });
};

loadCharacters();
