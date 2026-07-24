function ExploreSearch({
  searchInput,
  onSearchInputChange,
  onSearch,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <form
      className="explore-search-form"
      onSubmit={handleSubmit}
    >
      <span
        className="explore-search-icon"
        aria-hidden="true"
      >
        ⌕
      </span>

      <input
        type="search"
        value={searchInput}
        onChange={(event) =>
          onSearchInputChange(event.target.value)
        }
        placeholder="Search by guide company, destination, location or tour type..."
        aria-label="Search guide services"
      />

      <button type="submit">Search</button>
    </form>
  );
}

export default ExploreSearch;