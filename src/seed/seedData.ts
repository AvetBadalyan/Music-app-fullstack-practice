/**
 * Demo fixtures for `npm run seed`.
 *
 * Media is referenced by file name, not by URL: the seed script uploads the
 * matching file from the folders next to this one and uses whatever public URL
 * Supabase returns. That keeps the fixtures portable - anyone who clones the
 * repo seeds into their own bucket, rather than pointing at someone else's.
 */
export const genres = [
  { name: 'Jazz' },
  { name: 'Soul' },
  { name: 'Pop' },
  { name: 'Blues' },
];

export const artists = [
  {
    name: 'Charles Aznavour',
    bio: 'French-Armenian singer, lyricist, and actor.',
    profileImageFile: 'Charles Aznavour.jpg',
  },
  {
    name: 'Ray Charles',
    bio: 'American singer, songwriter, and pianist.',
    profileImageFile: 'Ray Charles.avif',
  },
  {
    name: 'Frank Sinatra',
    bio: 'American singer and actor, one of the most popular entertainers of the 20th century.',
    profileImageFile: 'frank sinatra.jpg',
  },
  {
    name: 'Stevie Wonder',
    bio: 'American singer, songwriter, musician, and record producer.',
    profileImageFile: 'Stevie Wonder.webp',
  },
];

export const albums = [
  {
    title: 'She',
    releaseDate: '1974-01-01',
    coverImageFile: 'she album.jpg',
    artist: 'Charles Aznavour',
  },
  {
    title: 'Genius Loves Company',
    releaseDate: '2004-08-31',
    coverImageFile: 'Genius Loves Company.jpg',
    artist: 'Ray Charles',
  },
  {
    title: 'In the Wee Small Hours',
    releaseDate: '1955-04-25',
    coverImageFile: 'In the Wee Small Hours.jpg',
    artist: 'Frank Sinatra',
  },
  {
    title: 'The Definitive Collection',
    releaseDate: '1976-09-28',
    coverImageFile: 'the definitive collection.jpg',
    artist: 'Stevie Wonder',
  },
];

export const songs = [
  {
    title: 'She',
    duration: 240,
    audioFileName: 'Charles Aznavour - She.mp3',
    artist: 'Charles Aznavour',
    album: 'She',
    genres: ['Jazz', 'Pop'],
  },
  {
    title: 'Hit the Road Jack',
    duration: 180,
    audioFileName: 'ray-charles - hit the road jack.mp3',
    artist: 'Ray Charles',
    album: 'Genius Loves Company',
    genres: ['Jazz', 'Blues'],
  },
  {
    title: 'Fly Me to the Moon',
    duration: 145,
    audioFileName: 'Frank Sinatra - Fly Me To The Moon.mp3',
    artist: 'Frank Sinatra',
    album: 'In the Wee Small Hours',
    genres: ['Jazz'],
  },
  {
    title: "Isn't She Lovely",
    duration: 210,
    audioFileName: "Stevie Wonder - Isn't She Lovely.mp3",
    artist: 'Stevie Wonder',
    album: 'The Definitive Collection',
    genres: ['Soul', 'Pop'],
  },
];
