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
    profilePicture:
      'https://tnopmeevynuyszzqarmk.supabase.co/storage/v1/object/public/artist-images/Charles%20Aznavour.jpg',
  },
  {
    name: 'Ray Charles',
    bio: 'American singer, songwriter, and pianist.',
    profilePicture:
      'https://tnopmeevynuyszzqarmk.supabase.co/storage/v1/object/public/artist-images/Ray%20Charles.avif',
  },
  {
    name: 'Frank Sinatra',
    bio: 'American singer and actor, one of the most popular entertainers of the 20th century.',
    profilePicture:
      'https://tnopmeevynuyszzqarmk.supabase.co/storage/v1/object/public/artist-images/frank%20sinatra.jpg',
  },
  {
    name: 'Stevie Wonder',
    bio: 'American singer, songwriter, musician, and record producer.',
    profilePicture:
      'https://tnopmeevynuyszzqarmk.supabase.co/storage/v1/object/public/artist-images/Stevie%20Wonder.webp',
  },
];

export const albums = [
  {
    title: 'She',
    releaseDate: '1974-01-01',
    coverImage:
      'https://tnopmeevynuyszzqarmk.supabase.co/storage/v1/object/public/album-covers/she%20album.jpg',
    artist: 'Charles Aznavour',
  },
  {
    title: 'Genius Loves Company',
    releaseDate: '2004-08-31',
    coverImage:
      'https://tnopmeevynuyszzqarmk.supabase.co/storage/v1/object/public/album-covers/Genius%20Loves%20Company.jpg',
    artist: 'Ray Charles',
  },
  {
    title: 'In the Wee Small Hours',
    releaseDate: '1955-04-25',
    coverImage:
      'https://tnopmeevynuyszzqarmk.supabase.co/storage/v1/object/public/album-covers/In%20the%20Wee%20Small%20Hours.jpg',
    artist: 'Frank Sinatra',
  },
  {
    title: 'The Definitive Collection',
    releaseDate: '1976-09-28',
    coverImage:
      'https://tnopmeevynuyszzqarmk.supabase.co/storage/v1/object/public/album-covers/the%20definitive%20collection.jpg',
    artist: 'Stevie Wonder',
  },
];

export const songs = [
  {
    title: 'She',
    duration: 240,
    audioFile:
      'https://tnopmeevynuyszzqarmk.supabase.co/storage/v1/object/public/Songs/Charles%20Aznavour%20-%20She.mp3',
    artist: 'Charles Aznavour',
    album: 'She',
    genres: ['Jazz', 'Pop'],
  },
  {
    title: 'Hit the Road Jack',
    duration: 180,
    audioFile:
      'https://tnopmeevynuyszzqarmk.supabase.co/storage/v1/object/public/Songs/ray-charles%20-%20hit%20the%20road%20jack.mp3',
    artist: 'Ray Charles',
    album: 'Genius Loves Company',
    genres: ['Jazz', 'Blues'],
  },
  {
    title: 'Fly Me to the Moon',
    duration: 145,
    audioFile:
      'https://tnopmeevynuyszzqarmk.supabase.co/storage/v1/object/public/Songs/Frank%20Sinatra%20-%20Fly%20Me%20To%20The%20Moon.mp3',
    artist: 'Frank Sinatra',
    album: 'In the Wee Small Hours',
    genres: ['Jazz'],
  },
  {
    title: "Isn't She Lovely",
    duration: 210,
    audioFile:
      "https://tnopmeevynuyszzqarmk.supabase.co/storage/v1/object/public/Songs/Stevie%20Wonder%20-%20Isn't%20She%20Lovely.mp3",
    artist: 'Stevie Wonder',
    album: 'The Definitive Collection',
    genres: ['Soul', 'Pop'],
  },
];
