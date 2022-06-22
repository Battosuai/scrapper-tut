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
  console.log(url);
  const { data } = await axios.get(url);
  const $ = load(data);
  let name = $('h2[data-source="name"').text();
  console.log(name);
  return characterName;
};

const loadCharacters = async () => {
  const characterNames = await getCharacterPageNames();
  for (let i = 0; i < characterNames.length; i++) {
    const characterInfo = await getCharacterInfo(characterNames[i]);
  }
};

loadCharacters();
