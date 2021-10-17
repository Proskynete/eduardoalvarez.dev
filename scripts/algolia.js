const fs = require("fs").promises;
const path = require("path");
const parser = require("xml2json");
const algoliasearch = require("algoliasearch");

(async function () {
  try {
    console.time("Algolia");
    console.log("Enviando posts a Algolia...");

    const rss = await fs.readFile(
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

    await index.saveObjects(posts);
    console.timeEnd("Algolia");
  } catch (err) {
    console.error(err);
  }
})();
