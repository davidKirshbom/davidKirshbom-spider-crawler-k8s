const crawler = (socket, startUrl, maxDepth, maxTotalPages) => {
  socket.emit("crawlerRequest", {
    startUrl,
    maxDepth,
    maxTotalPages,
  });
};

// const crawler = async (startUrl, maxDepth, maxTotalPages) => {
//   const data = (
//     await axios.get("http://localhost:3000", {
//       params: {
//         startUrl,
//         maxDepth,
//         maxTotalPages,
//       },
//     })
//   ).data;
//   return objToArray(data).sort((a, b) => a.depth - b.depth);
// };

// const data = (
//   await axios.get("http://localhost:3000", {
//     params: {
//       startUrl,
//       maxDepth,
//       maxTotalPages,
//     },
//   })
// ).data;

export { crawler };
