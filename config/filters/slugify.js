import slugify from 'slugify';

/** Converts string to a slug form. */
export default (str) => {
  return slugify(str || '', {
    lower: true,
    remove: /[*+~.()\"!:@]/g,
  });
};
