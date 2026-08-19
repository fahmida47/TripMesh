import { useState } from "react";
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
    <form
      className="explore-advanced-search"
      onSubmit={handleSubmit}
    >
      {/* Destination */}
      <div className="explore-advanced-field">
        <span className="explore-advanced-icon">
          ⌖
        </span>

        <div className="explore-advanced-content">
          <label htmlFor="explore-destination">
            Destination
          </label>

          <input
            id="explore-destination"
            type="search"
            value={searchInput}
            onChange={(event) =>
              onSearchInputChange(event.target.value)
            }
            placeholder="Where do you want to explore?"
          />
        </div>
      </div>

      {/* Price Range */}
      <div className="explore-advanced-field">
        <span className="explore-advanced-icon">
          ৳
        </span>

        <div className="explore-advanced-content">
          <label htmlFor="explore-price-range">
            Price Range
          </label>

          <select
            id="explore-price-range"
            value={priceRange}
            onChange={(event) =>
              onPriceRangeChange(event.target.value)
            }
          >
            <option value="">
              All Prices
            </option>

            <option value="low">
              ৳2,000 - ৳2,500
            </option>

            <option value="medium">
              ৳2,501 - ৳3,000
            </option>

            <option value="high">
              ৳3,001+
            </option>
          </select>
        </div>
      </div>

      {/* Tour Type */}
      <div className="explore-advanced-field">
        <span className="explore-advanced-icon">
          ♙
        </span>

        <div className="explore-advanced-content">
          <label htmlFor="explore-tour-type">
            Tour Type
          </label>

          <select
            id="explore-tour-type"
            value={tourType}
            onChange={(event) =>
              onTourTypeChange(event.target.value)
            }
          >
            <option value="">
              All Tour Types
            </option>

            <option value="Single Tour">
              Single Tour
            </option>

            <option value="Dual Tour">
              Dual Tour
            </option>

            <option value="Group Tour">
              Group Tour
            </option>
          </select>
        </div>
      </div>

      {/* Search */}
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