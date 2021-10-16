const fs = require("fs");
const globby = require("globby");
const matter = require("gray-matter");
const config = require("../data/config.json");
const prettier = require("prettier");

(async () => {
  try {
    console.time("Archivo RSS creado en");
    console.log("Creando archivo RSS...");
    const nameFiles = await globby(["content/posts/*.md"]);
    const prettierConfig = await prettier.resolveConfig("../.pretierrc");

    const data = nameFiles.map((nameFile, index) => {
      const slug = nameFile
        .replace(/^.*[\\/]/, "")
        .split(".")
        .slice(0, -1)
        .join(".");

      const data = fs.readFileSync(nameFiles[index], "utf8");
      const document = matter(data);

      return {
        frontmatter: JSON.parse(JSON.stringify(document.data)),
        markdownBody: document.content,
        slug,
      };
    });

    const dataSortered = data.sort((a, b) => {
      const _a = new Date(a.frontmatter.date);
      const _b = new Date(b.frontmatter.date);

      return _a > _b ? -1 : _a < _b ? 1 : 0;
    });

    const handlePrintItems = () =>
      dataSortered
        .map(
          (post) => `
			<item>
				<title>${post.frontmatter.title}</title>
				<link>${config.url}/articulos/${post.slug}</link>
				<pubDate>${new Date(post.frontmatter.date).toUTCString()}</pubDate>
				<guid>${config.url}/articulos/${post.slug}</guid>
				<description>${post.frontmatter.description}</description>
				${post.frontmatter.tags.map((tag) => `<category>${tag}</category>`).join("")}
			</item>`
        )
        .join("");

    const rss = `
			<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
				<channel>
					<title>${config.title}</title>
					<link>${config.url}</link>
					<description>${config.description}</description>
					<language>${config.languaje}</language>
					<lastBuildDate>
						${new Date(data[0].frontmatter.date).toUTCString()}
					</lastBuildDate>
					<atom:link href="${config.url}/rss.xml" rel="self" type="application/rss+xml"/>
						${handlePrintItems()}
				</channel>
			</rss>
		`;

    const formatted = prettier.format(rss, {
      ...prettierConfig,
      parser: "xml",
    });

    fs.writeFileSync("public/rss.xml", formatted);
    console.timeEnd("Archivo RSS creado en");
  } catch (error) {
    console.log("Error al crear el RSS");
    console.error(error);
  }
})();
