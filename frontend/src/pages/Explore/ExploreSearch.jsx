import "./ExploreSearch.css";

function ExploreSearch({
  searchInput,
  onSearchInputChange,
  onSearch,
  tourType,
  onTourTypeChange,
  priceRange,
  onPriceRangeChange,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <form className="explore-advanced-search" onSubmit={handleSubmit}>
      {/* Guide Company Name */}
      <div className="explore-advanced-field">
        <div className="explore-advanced-content">
          <label htmlFor="explore-company-name">
            Guide Company Name
          </label>

          <input
            id="explore-company-name"
            type="text"
            value={searchInput}
            onChange={(event) =>
              onSearchInputChange(event.target.value)
            }
            placeholder="Search by guide company name"
            autoComplete="off"
          />
        </div>
      </div>

      {/* Price */}
      <div className="explore-advanced-field">
        <div className="explore-advanced-content">
          <label htmlFor="explore-price">
            Price
          </label>

          <input
            id="explore-price"
            type="text"
            inputMode="numeric"
            value={priceRange}
            onChange={(event) =>
              onPriceRangeChange(event.target.value)
            }
            placeholder="Enter price"
            autoComplete="off"
          />
        </div>
      </div>

      {/* Tour Type */}
      <div className="explore-advanced-field">
        <div className="explore-advanced-content">
          <label htmlFor="explore-tour-type">
            Tour Type
          </label>

          <input
            id="explore-tour-type"
            type="text"
            value={tourType}
            onChange={(event) =>
              onTourTypeChange(event.target.value)
            }
            placeholder="Enter tour type"
            autoComplete="off"
          />
        </div>
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="explore-advanced-button"
      >
        Search
      </button>
    </form>
  );
}

export default ExploreSearch;