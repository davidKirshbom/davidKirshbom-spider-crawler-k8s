const HTMLParser = require("node-html-parser");
const axios = require("axios");
const { getUrlData, setUrlData } = require("../cache");

const getHtmlAnchorHrefs = (htmlPage, baseUrl) => {
  const anchors = htmlPage.querySelectorAll("a");
  const hrefs = anchors
    .map((anchor) => {
      let href = anchor.getAttribute("href");

      if (("" + href).startsWith("//")) return baseUrl + ("" + href).slice(2);

      if (("" + href).startsWith("/")) return baseUrl + href.toString();
      return href + "";
    })
    .filter((link) => !("" + link).startsWith("#") && link !== "undefined");

  return hrefs;
};
const parseUrlDataToObject = async (url) => {
  let pageHtml;
  const currentUrl = new URL(encodeURI(url));
  try {
    const cacheUrlData = await getUrlData(url);
    if (cacheUrlData) {
      return cacheUrlData;
    }
    const page = (await axios.get(currentUrl.toString())).data;
    pageHtml = HTMLParser.parse(page);
    const links = getHtmlAnchorHrefs(
      pageHtml,
      currentUrl.protocol + "//" + currentUrl.hostname
    );
    const title = pageHtml.querySelector("title")
      ? pageHtml.querySelector("title").innerText
      : "None";
    setUrlData(url, { title, links, url });
    return { title, links, url };
  } catch (err) {
    if (err.response)
      return {
        error: {
          status: err.response.status,
          message: err.response.statusText,
        },
      };
    else
      console.log(
        "🚀 ~ file: test.js ~ line 34 ~ parseUrlDataToObject ~ err",
        err
      );
  }
};
module.exports = { parseUrlDataToObject };
