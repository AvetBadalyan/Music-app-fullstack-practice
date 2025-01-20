export const genres = ['Jazz', 'Pop', 'Classical', 'Blues'];

export const artists = [
  {
    name: 'Charles Aznavour',
    bio: 'Famous French-Armenian singer and songwriter.',
    profile_picture: 'aznavour.jpg',
  },
  {
    name: 'Frank Sinatra',
    bio: 'Iconic American singer and actor.',
    profile_picture: 'sinatra.jpg',
  },
  {
    name: 'Ray Charles',
    bio: 'American singer, songwriter, and pianist.',
    profile_picture: 'ray-charles.jpg',
  },
];

export const albums = [
  {
    title: 'Best of Aznavour',
    release_date: '1980-01-01',
    cover_image: 'aznavour-best.jpg',
    artistName: 'Charles Aznavour',
  },
  {
    title: 'Frank Sinatra Hits',
    release_date: '1975-01-01',
    cover_image: 'sinatra-hits.jpg',
    artistName: 'Frank Sinatra',
  },
  {
    title: 'Aznavour in Paris',
    release_date: '1990-05-01',
    cover_image: 'aznavour-paris.jpg',
    artistName: 'Charles Aznavour',
  },
  {
    title: 'Live in London',
    release_date: '1995-11-15',
    cover_image: 'aznavour-london.jpg',
    artistName: 'Charles Aznavour',
  },
  {
    title: 'Ray Charles Greatest Hits',
    release_date: '1962-06-01',
    cover_image: 'ray-charles-hits.jpg',
    artistName: 'Ray Charles',
  },
];

export const songs = [
  ...[
    'La Bohème',
    'Yesterday When I Was Young',
    'She',
    'Emmenez-moi',
    'Aline',
    'Que c’est triste Venise',
    'For Me Formidable',
    'La Mamma',
    'Comme ils disent',
    'Non, je ne regrette rien',
  ].map((title, idx) => ({
    title,
    duration: 215 + idx * 10,
    audio_file: `${title.toLowerCase().replace(/ /g, '-')}.mp3`,
    albumTitle: 'Best of Aznavour',
    artistName: 'Charles Aznavour',
    genreNames: ['Jazz', 'Pop'],
  })),

  ...[
    'My Way',
    'Fly Me to the Moon',
    'Strangers in the Night',
    'New York, New York',
    'The Way You Look Tonight',
    'I’ve Got You Under My Skin',
    'Summer Wind',
    'Come Fly with Me',
    'That’s Life',
    'Luck Be a Lady',
  ].map((title, idx) => ({
    title,
    duration: 279 + idx * 5,
    audio_file: `${title.toLowerCase().replace(/ /g, '-')}.mp3`,
    albumTitle: 'Frank Sinatra Hits',
    artistName: 'Frank Sinatra',
    genreNames: ['Jazz'],
  })),

  ...[
    'La Bohème (Reprise)',
    'For Me Formidable (Live)',
    'Que c’est triste Venise',
    'Aline (Live)',
    'Non, je ne regrette rien',
    'La Mamma (Live)',
    'Yesterday When I Was Young (Reprise)',
    'Emmenez-moi (Live)',
    'Comme ils disent (Live)',
    'She (Reprise)',
  ].map((title, idx) => ({
    title,
    duration: 220 + idx * 8,
    audio_file: `${title.toLowerCase().replace(/ /g, '-')}.mp3`,
    albumTitle: 'Aznavour in Paris',
    artistName: 'Charles Aznavour',
    genreNames: ['Pop'],
  })),

  ...[
    'La Bohème (Live)',
    'I Am What I Am',
    'Dès Que Le Vent Soufflera',
    'Je Me Voyais Déjà',
    'La Mamma (Live)',
    'Non, Je Ne Regrette Rien',
    'Ave Maria',
    'Comme Ils Disent (Live)',
    'Les Comédiens',
    'For Me Formidable (Live)',
  ].map((title, idx) => ({
    title,
    duration: 225 + idx * 6,
    audio_file: `${title.toLowerCase().replace(/ /g, '-')}.mp3`,
    albumTitle: 'Live in London',
    artistName: 'Charles Aznavour',
    genreNames: ['Pop'],
  })),

  ...[
    'I Got a Woman',
    'Hit the Road Jack',
    'Georgia On My Mind',
    'What’d I Say',
    'Unchain My Heart',
    'You Don’t Know Me',
    'Let the Good Times Roll',
    'Baby, It’s Cold Outside',
    'Hallelujah, I Love Her So',
    'America the Beautiful',
  ].map((title, idx) => ({
    title,
    duration: 180 + idx * 5,
    audio_file: `${title.toLowerCase().replace(/ /g, '-')}.mp3`,
    albumTitle: 'Ray Charles Greatest Hits',
    artistName: 'Ray Charles',
    genreNames: ['Blues'],
  })),
];
