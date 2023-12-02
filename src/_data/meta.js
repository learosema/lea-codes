module.exports = {
  url: process.env.URL || '',
  siteName: "Lea's Blog",
  siteDescription: "This is the blog of Lea Rosema, frontend developer with accessibility focus, based in Hamburg",
  siteType: 'Person',
  locale: 'en_US',
  lang: 'en',
  author: 'Lea Rosema',
  authorEmail: 'lea@lea.lgbt',
  authorWebsite: 'https://blog.lea.lbgt',
  themeColor: '#DD4462',
  themeBgColor: '#F3F3F3',
  dateFormat: 'DD.MM.YYYY',
  meta_data: {
    opengraph_default: '/assets/images/social-preview/default.jpeg',
    opengraph_default_alt: "Lea's Blog",
    mastodonProfile: 'https://lea.lgbt/@lea',
  },
  pagination: {
    itemsPerPage: 20,
  },
};
