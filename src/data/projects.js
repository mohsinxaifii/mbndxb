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
    line: 'Cartons, labels and gift sets',
    title: 'Packaging',
    tags: ['Cartons', 'Gift sets', 'Labels', 'Pouches'],
    cover: 'packaging/01',
    tone: '#7A1F2B',
    intro: 'Cartons, tubes, tins, jars and gift sets for personal care, wellness and home brands, designed as product families so a full range reads as one on shelf.',
  },
  {
    slug: 'social-media',
    line: 'Always-on and launch content',
    title: 'Social Media',
    tags: ['Posts', 'Carousels', 'Launches', 'Offers'],
    cover: 'social-media/08',
    tone: '#E08A2C',
    intro: 'Always-on and campaign content for direct-to-consumer brands: launches, offers, education and seasonal moments, built to stop the scroll and earn the click.',
  },
  {
    slug: 'performance-marketing',
    line: 'Paid social, video and static',
    title: 'Performance Marketing',
    tags: ['Video ads', 'Reels', 'Stories'],
    cover: 'performance-marketing/09',
    tone: '#C23A5B',
    intro: 'Paid social creative built around a clear hook, a clear product and a clear call to action, produced in the formats each platform rewards.',
  },
  {
    slug: 'branding',
    line: 'Identities and stationery',
    title: 'Branding',
    tags: ['Logos', 'Identity', 'Stationery'],
    cover: 'branding/11',
    tone: '#23324F',
    intro: 'Logos, identity systems and stationery, from first explorations through to the applications that put them to work.',
  },
  {
    slug: 'motion-graphics',
    line: 'Brand films and product animation',
    title: 'Motion Graphics',
    tags: ['Brand films', 'Product animation'],
    cover: 'motion-graphics/01',
    tone: '#121110',
    intro: 'Brand films and product animation, cut for feeds, stories, marketplaces and in-store screens.',
  },
  {
    slug: 'web-banners',
    line: 'Homepage and marketplace',
    title: 'Web Banners',
    tags: ['Homepage', 'Marketplace', 'Sale seasons'],
    cover: 'web-banners/06',
    tone: '#B8456A',
    intro: 'Homepage and marketplace banners for launches, sale seasons and festive campaigns, composed to read at a glance at any size.',
  },
  {
    slug: 'emailers',
    line: 'Launch, sale and retention mail',
    title: 'Emailers',
    tags: ['Launches', 'Sales', 'App installs'],
    cover: 'emailers/01',
    tone: '#3E2A1E',
    intro: 'Launch, promotional and retention emailers designed to hold attention from the first fold to the button.',
  },
  {
    slug: 'print',
    line: 'Catalogues and leaflets',
    title: 'Print',
    tags: ['Catalogues', 'Leaflets', 'Inserts'],
    cover: 'print/01',
    tone: '#1F3557',
    intro: 'Product catalogues, leaflets and pack inserts, with dense information organised to be read at a glance.',
  },
]

export const bySlug = Object.fromEntries(projects.map(p => [p.slug, p]))
