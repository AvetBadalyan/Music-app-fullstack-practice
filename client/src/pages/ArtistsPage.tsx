import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useSearchArtistsQuery } from '../services/artistsApi'
import SearchBar from '../components/common/SearchBar'
import ArtistList from '../components/artists/ArtistList'
import CreateArtistForm from '../components/forms/CreateArtistForm'

const ArtistsPage = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [showForm, setShowForm] = useState(false)
    const { data: artists, isLoading } = useSearchArtistsQuery(searchTerm, {
        skip: searchTerm.length === 0
    })

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
