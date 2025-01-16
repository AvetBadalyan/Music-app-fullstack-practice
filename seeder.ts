import { AppDataSource } from './data-source';
import { Artist, Album, Song, Genre } from './src/entities';

async function seedDatabase() {
  const dataSource = await AppDataSource.initialize();

  const jazz = new Genre();
  jazz.name = 'Jazz';

  const pop = new Genre();
  pop.name = 'Pop';

  await dataSource.manager.save([jazz, pop]);

  const aznavour = new Artist();
  aznavour.name = 'Charles Aznavour';
  aznavour.bio = 'Famous French-Armenian singer and songwriter.';
  aznavour.profile_picture = 'aznavour.jpg';

  const sinatra = new Artist();
  sinatra.name = 'Frank Sinatra';
  sinatra.bio = 'Iconic American singer and actor.';
  sinatra.profile_picture = 'sinatra.jpg';

  await dataSource.manager.save([aznavour, sinatra]);

  const aznavourAlbum = new Album();
  aznavourAlbum.title = 'Best of Aznavour';
  aznavourAlbum.release_date = '1980-01-01';
  aznavourAlbum.cover_image = 'aznavour-best.jpg';
  aznavourAlbum.artist = aznavour;

  const sinatraAlbum = new Album();
  sinatraAlbum.title = 'Frank Sinatra Hits';
  sinatraAlbum.release_date = '1975-01-01';
  sinatraAlbum.cover_image = 'sinatra-hits.jpg';
  sinatraAlbum.artist = sinatra;

  await dataSource.manager.save([aznavourAlbum, sinatraAlbum]);

  const song1 = new Song();
  song1.title = 'La Bohème';
  song1.duration = 215;
  song1.audio_file = 'la-boheme.mp3';
  song1.album = aznavourAlbum;
  song1.artist = aznavour;
  song1.genres = [jazz, pop];

  const song2 = new Song();
  song2.title = 'My Way';
  song2.duration = 279;
  song2.audio_file = 'my-way.mp3';
  song2.album = sinatraAlbum;
  song2.artist = sinatra;
  song2.genres = [jazz];

  await dataSource.manager.save([song1, song2]);

  console.log('Database seeded successfully!');
  await dataSource.destroy();
}

seedDatabase().catch(error => console.error('Error seeding database:', error));
