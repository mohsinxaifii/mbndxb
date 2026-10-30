// The work, grouped by type. Each category's pieces are whatever files sit in
// media-source/<slug>/, in filename order. To update the work: add, remove or
// rename files there and run `npm run media`.
//
// cover  the piece used for cards, previews and the page hero (a media key)
// tags   the formats inside, shown as small labels
// tone   a colour drawn from the work, used for small accents

export const projects = [
  {
    slug: 'packaging',
    title: 'Packaging',
    tags: ['Cartons', 'Gift sets', 'Labels', 'Pouches'],
    cover: 'packaging/01',
    tone: '#7A1F2B',
    intro: 'Boxes, tubes, tins, jars and gift sets for personal care, wellness and home brands. Designed as families, so a whole range reads as one on the shelf.',
  },
  {
    slug: 'social-media',
    title: 'Social Media',
    tags: ['Posts', 'Carousels', 'Launches', 'Offers'],
    cover: 'social-media/03',
    tone: '#E08A2C',
    intro: 'Feed posts for brands that sell online: launches, offers, how-tos, reviews and festive moments, made to stop a thumb mid-scroll.',
  },
  {
    slug: 'performance-marketing',
    title: 'Performance Marketing',
    tags: ['Video ads', 'Reels', 'Stories'],
    cover: 'performance-marketing/03',
    tone: '#C23A5B',
    intro: 'Short ads built for paid social: a hook in the first second, the product in the second, and a reason to tap before it loops.',
  },
  {
    slug: 'branding',
    title: 'Branding',
    tags: ['Logos', 'Identity', 'Stationery'],
    cover: 'branding/03',
    tone: '#23324F',
    intro: 'Marks, identity systems and the stationery that carries them, from first explorations to the mock-ups that put them to work.',
  },
  {
    slug: 'motion-graphics',
    title: 'Motion Graphics',
    tags: ['Brand films', 'Product animation'],
    cover: 'motion-graphics/01',
    tone: '#121110',
    intro: 'Brand films and product animation, cut for feeds, stories and screens.',
  },
  {
    slug: 'web-banners',
    title: 'Web Banners',
    tags: ['Homepage', 'Marketplace', 'Sale seasons'],
    cover: 'web-banners/04',
    tone: '#B8456A',
    intro: 'Homepage and marketplace banners for launches, sale seasons and festive drops, composed to read at a glance at any width.',
  },
  {
    slug: 'emailers',
    title: 'Emailers',
    tags: ['Launches', 'Sales', 'App installs'],
    cover: 'emailers/01',
    tone: '#3E2A1E',
    intro: 'Long-scroll emailers that hold attention from subject line to button. Hover a mailer to read it top to bottom.',
  },
  {
    slug: 'print',
    title: 'Print',
    tags: ['Catalogues', 'Leaflets', 'Inserts'],
    cover: 'print/01',
    tone: '#1F3557',
    intro: 'Catalogues, leaflets and pack inserts, with dense product information laid out to be read in one pass.',
  },
]

export const bySlug = Object.fromEntries(projects.map(p => [p.slug, p]))
