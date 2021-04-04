const formValidation = (form) => {
  let errors;
  const maxDepth = parseInt(form["max-depth"].value);
  const maxPages = parseInt(form["max-pages"].value);

  if (!maxDepth) errors.maxDepth = true;
  if (!maxPages) errors.maxPages = true;
  if (form["url"] === "") errors.url = true;

  return errors;
};

export { formValidation };
