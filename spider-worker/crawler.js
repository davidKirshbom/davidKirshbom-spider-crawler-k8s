const { sqs } = require("./sqs/awsSqs");
const { parseUrlDataToObject } = require("./utils/parseUrlDataToObject");
let jobsQueue;

const crawlerSpider = async (
  startUrl,
  maxDepth,
  maxTotalPages,
  newPageVisitFunc
) => {
  let pages = {};
  let pagesCount = 1;
  let startUrlData = await parseUrlDataToObject(startUrl);
  if (startUrlData.error) throw new Error(startUrlData.error);
  pages = {
    [startUrl]: { depth: 0, pagesCount, ...startUrlData },
  };
  await newPageVisitFunc(pages[startUrl]);

  const crawler = async (url, depth) => {
    let urlData = pages[url];
    depth++;
    if (depth > maxDepth) return;
    if (urlData.links) {
      const nextLinks = [];
      for (const link of urlData.links) {
        if (!pages[link] && link !== url) {
          urlData = await parseUrlDataToObject(link);
          pagesCount++;
          if (pagesCount > maxTotalPages) return;
          pages = {
            ...pages,
            [link]: { depth, pagesCount, ...urlData },
          };
          await newPageVisitFunc(pages[link]);
          nextLinks.push(link);
        }
      }
      for (const link of nextLinks) {
        await crawler(link, depth);
      }
    }
  };
  await crawler(startUrl, 0); //start recursive function

  return pages;
};

module.exports = crawlerSpider;
