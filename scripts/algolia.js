const fs = require("fs");
const path = require("path");
const parser = require("xml2json");
const algoliasearch = require("algoliasearch");

(async function () {
  console.time("Envío de posts");
  console.log("Enviando posts a Algolia...");

  const rss = fs.readFileSync(
    path.resolve(__dirname, "../public/rss.xml"),
    "utf8"
  );
  const json = parser.toJson(rss, { object: true });

  const client = algoliasearch(
    process.env.ALGOLIA_APPICATION_ID,
    process.env.ALGOLIA_ADMIN_API_KEY
  );
  const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);

  const posts = json.rss.channel.item.map((post) => ({
    ...post,
    objectID: post.guid,
  }));

  index
    .saveObjects(posts)
    .then(() => {
      console.timeEnd("Envío de posts");
    })
    .catch((err) => {
      console.error(err);
    });
})();
