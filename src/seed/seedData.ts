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
  { name: 'Rock' },
  { name: 'Reggae' },
  { name: 'Rap' },
  { name: 'Folk' },
  { name: 'Chanson' },
];

export const artists = [
  {
    name: 'Charles Aznavour',
    bio: 'French-Armenian singer, lyricist, and actor.',
    profileImageFile: 'Charles Aznavour.webp',
  },
  {
    name: 'Ray Charles',
    bio: 'American singer, songwriter, and pianist.',
    profileImageFile: 'Ray Charles.webp',
  },
  {
    name: 'Frank Sinatra',
    bio: 'American singer and actor, one of the most popular entertainers of the 20th century.',
    profileImageFile: 'frank sinatra.webp',
  },
  {
    name: 'Stevie Wonder',
    bio: 'American singer, songwriter, musician, and record producer.',
    profileImageFile: 'Stevie Wonder.webp',
  },
  {
    name: 'Deep Purple',
    bio: 'English hard rock band and pioneers of heavy metal.',
    profileImageFile: 'deep-purple-logo.webp',
  },
  {
    name: 'Pink Floyd',
    bio: 'English progressive rock band known for their concept albums.',
    profileImageFile: 'pink.webp',
  },
  {
    name: 'Bob Marley',
    bio: 'Jamaican reggae singer-songwriter and a global music icon.',
    profileImageFile: 'bob marley.webp',
  },
  {
    name: '2Pac',
    bio: 'American rapper and actor, one of hip-hop\'s most influential figures.',
    profileImageFile: '2pac.webp',
  },
  {
    name: 'Tata Simonyan',
    bio: 'Armenian singer and songwriter, a star of Armenian pop.',
    profileImageFile: 'tata.webp',
  },
  {
    name: 'Grigory Leps',
    bio: 'Russian singer known for his powerful rock and pop ballads.',
    profileImageFile: 'leps.webp',
  },
  {
    name: 'Komitas',
    bio: 'Armenian composer and musicologist, the father of Armenian classical music.',
    profileImageFile: 'Komitas.webp',
  },
  {
    name: 'Edith Piaf',
    bio: 'French singer, one of France\'s most celebrated performers.',
    profileImageFile: 'piaf.webp',
  },
];

export const albums = [
  {
    title: 'She',
    releaseDate: '1974-01-01',
    coverImageFile: 'she album.webp',
    artist: 'Charles Aznavour',
  },
  {
    title: 'Genius Loves Company',
    releaseDate: '2004-08-31',
    coverImageFile: 'Genius Loves Company.webp',
    artist: 'Ray Charles',
  },
  {
    title: 'In the Wee Small Hours',
    releaseDate: '1955-04-25',
    coverImageFile: 'In the Wee Small Hours.webp',
    artist: 'Frank Sinatra',
  },
  {
    title: 'The Definitive Collection',
    releaseDate: '1976-09-28',
    coverImageFile: 'the definitive collection.webp',
    artist: 'Stevie Wonder',
  },
  {
    title: 'Machine Head',
    releaseDate: '1972-03-25',
    coverImageFile: 'machine head.webp',
    artist: 'Deep Purple',
  },
  {
    title: 'The Dark Side of the Moon',
    releaseDate: '1973-03-01',
    coverImageFile: 'dark side.webp',
    artist: 'Pink Floyd',
  },
  {
    title: 'Legend',
    releaseDate: '1984-05-08',
    coverImageFile: 'legend bob markey.webp',
    artist: 'Bob Marley',
  },
  {
    title: 'All Eyez on Me',
    releaseDate: '1996-02-13',
    coverImageFile: 'all eyez on me.webp',
    artist: '2Pac',
  },
  {
    title: 'Ov e Na',
    releaseDate: '1999-01-01',
    coverImageFile: 'ov e na.webp',
    artist: 'Tata Simonyan',
  },
  {
    title: 'Vodopad',
    releaseDate: '2002-01-01',
    coverImageFile: 'vodopad.webp',
    artist: 'Grigory Leps',
  },
  {
    title: 'Armenian Sacred Music',
    releaseDate: '1912-01-01',
    coverImageFile: 'komitas album.webp',
    artist: 'Komitas',
  },
  {
    title: "L'Essentiel",
    releaseDate: '1960-01-01',
    coverImageFile: "piaf L'Essentiel.webp",
    artist: 'Edith Piaf',
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
  {
    title: 'Smoke on the Water',
    duration: 340,
    audioFileName:
      'Deep_Purple_-_Smoke_On_The_Water_Pesnya-legenda_Eyo_znayut_vse_Dazhe_te_kto_i_slyhom_ne_slyhival_o_s_(mp3.pm).mp3',
    artist: 'Deep Purple',
    album: 'Machine Head',
    genres: ['Rock'],
  },
  {
    title: 'Money',
    duration: 382,
    audioFileName: 'Pink Floyd - Money - 2011 Remastered Version.mp3',
    artist: 'Pink Floyd',
    album: 'The Dark Side of the Moon',
    genres: ['Rock'],
  },
  {
    title: 'Redemption Song',
    duration: 228,
    audioFileName:
      'Bob_Marley_-_Redemption_Song_OST_serial_LOST_Ostatsya_v_zhivyh_1_sezon_(mp3.pm).mp3',
    artist: 'Bob Marley',
    album: 'Legend',
    genres: ['Reggae'],
  },
  {
    title: 'California Love',
    duration: 285,
    audioFileName: '2Pac_-_california_love_original_version_(mp3.pm).mp3',
    artist: '2Pac',
    album: 'All Eyez on Me',
    genres: ['Rap'],
  },
  {
    title: 'Ov e Na',
    duration: 240,
    audioFileName: 'Tata Simonyan - Ov E Na.mp3',
    artist: 'Tata Simonyan',
    album: 'Ov e Na',
    genres: ['Pop'],
  },
  {
    title: 'Vodopad',
    duration: 268,
    audioFileName:
      'Григорий Лепс - Рюмка водки на столе (Единственный лагучий оригинал песни).mp3',
    artist: 'Grigory Leps',
    album: 'Vodopad',
    genres: ['Pop'],
  },
  {
    title: 'Krunk',
    duration: 198,
    audioFileName: 'Komitas - KOMITAS - Krunk (hitmo.net).mp3',
    artist: 'Komitas',
    album: 'Armenian Sacred Music',
    genres: ['Folk'],
  },
  {
    title: 'Non, je ne regrette rien',
    duration: 142,
    audioFileName: 'Edith Piaf - Non, je ne regrette rien.mp3',
    artist: 'Edith Piaf',
    album: "L'Essentiel",
    genres: ['Chanson'],
  },
];
