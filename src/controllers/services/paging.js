module.exports = {
  paging: async (req, res, data, pagUser) => {
    let prevPage = (nextPage = null);
    let countPages = (currentPage = 1);
    let { countItems, items } = data;

    if (countItems > 10) {
      Number.isInteger(countItems / 10)
        ? (countPages = countItems / 10)
        : (countPages = Math.trunc(countItems / 10) + 1);

      if (req.query.page) {
        if (req.query.page <= countPages) {
          currentPage = Number(req.query.page);
          currentPage > 1 ? (prevPage = currentPage - 1) : null;

          currentPage > 1
            ? (prevPage = "api/" + pagUser + "/?page=" + (currentPage - 1))
            : null;

          currentPage < countPages
            ? (nextPage = "api/" + pagUser + "/?page=" + (currentPage + 1))
            : null;
        } else {
          res.status(404).json({ error: "There is nothing here." });
        }
      } else {
        nextPage = "api/" + pagUser + "/?page=2";
      }
    }

    if (items.length > 10) {
      items = items.slice((currentPage - 1) * 10, currentPage * 10);
    }

    res.status(200).json(
      Object({
        info: {
          count: countItems,
          pages: countPages,
          prev: prevPage,
          next: nextPage,
        },
        data: items,
      })
    );
  },
};
