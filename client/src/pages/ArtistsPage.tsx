import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import {
    useGetAllArtistsQuery,
    useSearchArtistsQuery,
} from '../services/artistsApi'
import SearchBar from '../components/common/SearchBar'
import ArtistList from '../components/artists/ArtistList'
import CreateArtistForm from '../components/forms/CreateArtistForm'

const ArtistsPage = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [showForm, setShowForm] = useState(false)
    const isSearching = searchTerm.length > 0
    const { data: allArtists, isLoading: isLoadingAll } = useGetAllArtistsQuery(
        undefined,
        { skip: isSearching },
    )
    const { data: searchResults, isLoading: isSearchLoading } =
        useSearchArtistsQuery(searchTerm, { skip: !isSearching })

    const artists = isSearching ? searchResults : allArtists
    const isLoading = isSearching ? isSearchLoading : isLoadingAll

    return (
        <div className="artists-page">
            <div className="page-toolbar">
                <h1>Artists</h1>
                <button
                    type="button"
                    className="toolbar-toggle"
                    onClick={() => setShowForm((v) => !v)}
                >
                    {showForm ? <X size={16} /> : <Plus size={16} />}
                    <span>{showForm ? 'Close' : 'New artist'}</span>
                </button>
            </div>
            {showForm && <CreateArtistForm />}
            <SearchBar
                placeholder="Search artists by name..."
                value={searchTerm}
                onChange={setSearchTerm}
            />
            {isLoading ? (
                <p className="loading">Loading...</p>
            ) : (
                <ArtistList artists={artists ?? []} />
            )}
        </div>
    )
}

export default ArtistsPage
