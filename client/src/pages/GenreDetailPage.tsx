import { useParams } from 'react-router-dom'
import { useGetGenreByIdQuery } from '../services/genresApi'
import SongList from '../components/songs/SongList'

const GenreDetailPage = () => {
    const { id } = useParams<{ id: string }>()
    const { data: genre, isLoading, error } = useGetGenreByIdQuery(id!)

    if (isLoading) return <p className="loading">Loading...</p>
    if (error || !genre) return <p className="error">Genre not found.</p>

    return (
        <div className="genre-detail-page">
            <h1>{genre.name}</h1>
            {genre.songs && genre.songs.length > 0 ? (
                <SongList songs={genre.songs} />
            ) : (
                <p className="empty">No songs in this genre yet.</p>
            )}
        </div>
    )
}

export default GenreDetailPage
