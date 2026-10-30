// The work, in the order it is shown. Media keys point into media.json, which
// `npm run media` builds from media-source/<slug>/<section>-NN.*
//
// cover   the image used for cards, previews and the project hero
// mark    optional client logo shown in the project header
// sections render in this order; `key` matches the file prefix in media-source

export const disciplines = ['Packaging', 'Identity', 'Campaigns', 'Digital', 'Print', 'Motion']

export const projects = [
  {
    slug: 'the-ayurveda-co',
    title: 'The Ayurveda Co.',
    client: 'The Ayurveda Co. (TAC)',
    disciplines: ['Packaging', 'Campaigns', 'Print'],
    cover: 'the-ayurveda-co/packaging-01',
    mark: 'the-ayurveda-co/mark-01',
    tone: '#7A1F2B',
    intro: 'An Ayurvedic personal-care house with a deep shelf: facial kits, serums, sunscreens, baby care and gift tins. The work runs from the box on the shelf to the banner that sells it, covering packaging, festive gifting, catalogue pages and a steady stream of campaign creatives.',
    sections: [
      { key: 'packaging', title: 'Packaging', note: 'Cartons, tubes, tins and gift sets, drawn as one family.' },
      { key: 'campaigns', title: 'Campaigns', note: 'Launches, sale seasons and festive drops across social and web.' },
      { key: 'print', title: 'Print', note: 'Stationery and the product catalogue.' },
    ],
  },
  {
    slug: 'khadi-essentials',
    title: 'Khadi Essentials',
    client: 'Khadi Essentials',
    disciplines: ['Packaging', 'Identity'],
    cover: 'khadi-essentials/packaging-07',
    mark: 'khadi-essentials/mark-01',
    tone: '#8A6A3B',
    intro: 'Kraft, gold and botanical illustration for a luxury Ayurveda line. Serums, shampoos, sheet masks and hair masks that read as one family on the shelf.',
    sections: [
      { key: 'packaging', title: 'Packaging', note: 'Kraft cartons, amber glass and gold foil.' },
    ],
  },
  {
    slug: 'sanfe',
    title: 'Sanfe',
    client: 'Sanfe',
    disciplines: ['Packaging'],
    cover: 'sanfe/packaging-07',
    mark: 'sanfe/mark-01',
    tone: '#5B4B9A',
    intro: 'Clear, confident packaging for a women’s body-care brand: tan removal, wax strips and reusable silicone covers, designed to say exactly what’s inside.',
    sections: [
      { key: 'packaging', title: 'Packaging', note: 'Jars, tubes and boxes in lavender, coral and blush.' },
    ],
  },
  {
    slug: 'cleanex-india',
    title: 'Cleanex India',
    client: 'Cleanex India · KraPht',
    disciplines: ['Identity', 'Packaging', 'Print'],
    cover: 'cleanex-india/packaging-05',
    mark: 'cleanex-india/mark-01',
    tone: '#7DBE2E',
    intro: 'Identity and packaging for a tissue brand and its sub-line KraPht. A lime-and-sky palette, with a lace-like mandala that wraps every box, pack and pouch.',
    sections: [
      { key: 'identity', title: 'Identity', note: 'Marks for Cleanex and KraPht, and the cards that carry them.' },
      { key: 'packaging', title: 'Packaging', note: 'Tissue boxes, cubes, soft packs and pouches.' },
    ],
  },
  {
    slug: 'identities',
    title: 'Marks & Identities',
    client: 'Various',
    disciplines: ['Identity', 'Print'],
    cover: 'identities/kapha-03',
    tone: '#23324F',
    intro: 'Logos and identity work for Kapha, BMN Group, GMC, Arata, Werd Wesham and Nuktacheen: explorations, final marks and the mock-ups that put them to work.',
    sections: [
      { key: 'kapha', title: 'Kapha' },
      { key: 'bmn-group', title: 'BMN Group' },
      { key: 'gmc', title: 'GMC' },
      { key: 'werd-wesham', title: 'Werd Wesham' },
      { key: 'arata', title: 'Arata' },
      { key: 'nuktacheen', title: 'Nuktacheen' },
      { key: 'stationery', title: 'Stationery' },
    ],
  },
  {
    slug: 'social-creatives',
    title: 'Social Creatives',
    client: 'TAC, Amaara and others',
    disciplines: ['Campaigns', 'Digital'],
    cover: 'social-creatives/posts-03',
    tone: '#E08A2C',
    intro: 'Posts for beauty and wellness brands that sell online: offers, launches, how-tos, reviews, and the occasional onion that makes you cry.',
    sections: [
      { key: 'posts', title: 'Posts', note: 'Square formats for feed and ads.' },
    ],
  },
  {
    slug: 'motion',
    title: 'Motion & Film',
    client: 'TAC, Amaara, Sanfe and others',
    disciplines: ['Motion', 'Campaigns'],
    cover: 'motion/films-01',
    tone: '#121110',
    intro: 'Brand films, product animation and performance ads, cut for feeds, stories and screens.',
    sections: [
      { key: 'films', title: 'Films', note: 'Brand and product films.' },
      { key: 'performance', title: 'Performance', note: 'Ads made to be watched on mute and acted on.' },
    ],
  },
  {
    slug: 'web-banners',
    title: 'Web Banners',
    client: 'The Ayurveda Co. and others',
    disciplines: ['Digital', 'Campaigns'],
    cover: 'web-banners/banners-04',
    tone: '#C23A5B',
    intro: 'Homepage and marketplace banners for sale seasons, launches and festive drops, composed to read at a glance at any width.',
    sections: [
      { key: 'banners', title: 'Banners' },
    ],
  },
  {
    slug: 'emailers',
    title: 'Emailers',
    client: 'TAC, mCaffeine, Arata, Vahdam',
    disciplines: ['Digital', 'Campaigns'],
    cover: 'emailers/emailers-01',
    tone: '#3E2A1E',
    intro: 'Long-scroll emailers for launches, sales and app installs. Hover a mailer to read it top to bottom.',
    sections: [
      { key: 'emailers', title: 'Emailers' },
    ],
  },
  {
    slug: 'jstor',
    title: 'Jstor',
    client: 'Jstor',
    disciplines: ['Campaigns', 'Digital'],
    cover: 'jstor/posts-07',
    mark: 'jstor/mark-01',
    tone: '#B5301F',
    intro: 'Social creatives for smartwatches, yoga mats and kitchen storage, with bold type and a lot of orange.',
    sections: [
      { key: 'posts', title: 'Posts' },
    ],
  },
  {
    slug: 'copfab',
    title: 'Copfab',
    client: 'Copfab',
    disciplines: ['Packaging', 'Print'],
    cover: 'copfab/print-05',
    tone: '#1F3557',
    intro: 'Packaging and an explainer leaflet for an antibacterial copper mask: the science, the sizes and the colours, laid out to be read in one pass.',
    sections: [
      { key: 'print', title: 'Print & pack' },
    ],
  },
  {
    slug: 'forest-essentials',
    title: 'Forest Essentials',
    client: 'Forest Essentials',
    disciplines: ['Packaging'],
    cover: 'forest-essentials/packaging-01',
    mark: 'forest-essentials/mark-01',
    tone: '#1D2147',
    intro: 'A Diwali gift box: peacocks on midnight blue, and a lantern-hung edition in white.',
    sections: [
      { key: 'packaging', title: 'Festive gifting' },
    ],
  },
]

export const featured = ['the-ayurveda-co', 'khadi-essentials', 'sanfe', 'cleanex-india', 'identities', 'social-creatives']

export const bySlug = Object.fromEntries(projects.map(p => [p.slug, p]))
