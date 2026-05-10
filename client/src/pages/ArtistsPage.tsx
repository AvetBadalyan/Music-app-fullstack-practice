import { useState } from 'react'
import { useSearchArtistsQuery } from '../services/artistsApi'
import SearchBar from '../components/common/SearchBar'
import ArtistList from '../components/artists/ArtistList'

const ArtistsPage = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const { data: artists, isLoading } = useSearchArtistsQuery(searchTerm, {
        skip: searchTerm.length === 0
    })

    return (
        <div className="artists-page">
            <h1>Artists</h1>
            <SearchBar
                placeholder="Search artists by name..."
                value={searchTerm}
                onChange={setSearchTerm}
            />
            {searchTerm.length === 0 ? (
                <p className="hint">Start typing to search for artists...</p>
            ) : isLoading ? (
                <p className="loading">Loading...</p>
            ) : (
                <ArtistList artists={artists ?? []} />
            )}
        </div>
    )
}

export default ArtistsPage
