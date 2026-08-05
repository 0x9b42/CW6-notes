module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");

  eleventyConfig.addCollection("pars", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/pars/*.md").sort((a, b) => {
      return a.data.paragraph_id.localeCompare(b.data.paragraph_id);
    });
  });

  eleventyConfig.addFilter("adjacentByParagraphId", function (collection, paragraphId) {
    const items = [...collection].sort((a, b) => {
      return a.data.paragraph_id.localeCompare(b.data.paragraph_id);
    });

    const index = items.findIndex((item) => item.data.paragraph_id === paragraphId);

    return {
      prev: index > 0 ? items[index - 1] : null,
      next: index >= 0 && index < items.length - 1 ? items[index + 1] : null,
    };
  });

  eleventyConfig.addGlobalData("getText", function () {
    const fs = require("fs");
    const path = require("path");
    return function (paragraphId) {
      const jsonPath = path.join(__dirname, "src/pars", `${paragraphId}.json`);
      if (!fs.existsSync(jsonPath)) return null;
      return JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    };
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    pathPrefix: "/CW6-notes/",
  };
};
