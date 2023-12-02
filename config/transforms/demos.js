// Moves style and link[rel="stylesheet"] tags from body up to the head.
// Just because they don't belong there.
module.exports = function ({document}) {
  document.body.querySelectorAll('style, link[rel="stylesheet"]').forEach(element => {
    element.remove();
    document.head.appendChild(element);
  });
};
