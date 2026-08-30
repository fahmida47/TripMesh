import { useEffect, useState } from "react";
import "./Explore.css";
import ExploreHero from "./ExploreHero";
import ExploreSearch from "./ExploreSearch";

const API_BASE_URL = "http://127.0.0.1:8000/api";
const STORAGE_URL = "http://127.0.0.1:8000/storage";

function GuideCard({ guide }) {
  return (
    <article className="explore-guide-card">

      <div className="explore-card-content">

        {/* Company */}
        <div className="explore-company-heading">

          <div className="explore-company-logo">
            {guide.companyName
              ? guide.companyName.charAt(0).toUpperCase()
              : "G"}
          </div>

          <div className="explore-company-title">
            <h3>
              {guide.companyName || "Guide Company"}
            </h3>

            <p className="explore-location">
              {guide.location || "Bangladesh"}
            </p>
          </div>

        </div>

        {/* Tour Types */}
        {guide.tourTypes && guide.tourTypes.length > 0 && (
          <div className="explore-tour-badges">
            {guide.tourTypes.map((type, index) => (
              <span
                className="explore-tour-badge"
                key={`${type}-${index}`}
              >
                {type}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="explore-guide-description">
          {guide.description ||
            "Explore Bangladesh with experienced local guides and discover memorable destinations."}
        </p>

        {/* Experiences */}
        {guide.experiences &&
          guide.experiences.length > 0 && (
            <div className="explore-experiences">

              <div className="experience-heading">
                <h4>Experiences</h4>
                <span>{guide.experiences.length}</span>
              </div>

              {guide.experiences.slice(0, 2).map((experience) => (
                <div
                  className="experience-item"
                  key={experience.id}
                >

                  {experience.photo ? (
                    <img
                      src={`${STORAGE_URL}/${experience.photo}`}
                      alt={experience.title || "Experience"}
                    />
                  ) : (
                    <div className="experience-placeholder">
                      📍
                    </div>
                  )}

                  <div className="experience-text">
                    <strong>
                      {experience.title || "Tour Experience"}
                    </strong>

                    <p>
                      {experience.description ||
                        "Discover amazing places and local experiences."}
                    </p>
                  </div>

                </div>
              ))}

            </div>
          )}

        {/* Rating + Price */}
        <div className="explore-guide-meta">

          <div className="explore-rating">
            <span className="explore-star">★</span>

            <strong>
              {Number(guide.rating || 0).toFixed(1)}
            </strong>

            <span>
              ({guide.reviews || 0} reviews)
            </span>
          </div>

          <div className="explore-price">
            <span>From</span>

            <strong>
              ৳{Number(guide.price || 0).toLocaleString()}
            </strong>
          </div>

        </div>

        {/* Buttons */}
        <div className="explore-card-actions">

          <button
            type="button"
            className="explore-secondary-button"
          >
            View Details
          </button>

          <button
            type="button"
            className="explore-primary-button"
          >
            Send Request
          </button>

        </div>

      </div>
    </article>
  );
}

function Explore({ embedded = false }) {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTourType, setSelectedTourType] = useState("");
  const [searchTourType, setSearchTourType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [searchPriceRange, setSearchPriceRange] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  const [viewMode, setViewMode] = useState("grid");

  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalGuides, setTotalGuides] = useState(0);

  const fetchGuides = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      if (searchTourType) {
        params.append("tour_type", searchTourType);
      }

      if (searchPriceRange) {
        params.append("price_range", searchPriceRange);
      }

      params.append("sort", sortBy);
      params.append("page", page);
      params.append("per_page", 6);

      const response = await fetch(
        `${API_BASE_URL}/guides/explore?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      setGuides(data.data || []);
      setCurrentPage(data.current_page || 1);
      setLastPage(data.last_page || 1);
      setTotalGuides(data.total || 0);

    } catch (err) {
      console.error("Explore fetch error:", err);

      setError("Unable to load guide services.");
      setGuides([]);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides(1);
  }, []);

  const handleSearch = () => {
    const newSearch = searchInput.trim().toLowerCase();

    setSearchTerm(newSearch);
    setSearchTourType(selectedTourType);
    setSearchPriceRange(priceRange);
    setCurrentPage(1);

    setTimeout(() => {
      fetchGuides(1);
    }, 0);
  };

  const handleSortChange = (event) => {
    const value = event.target.value;

    setSortBy(value);
    setCurrentPage(1);

    setTimeout(() => {
      fetchGuides(1);
    }, 0);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > lastPage) {
      return;
    }

    setCurrentPage(page);
    fetchGuides(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="explore-page">

      <ExploreHero showNavbar={!embedded} />

      <main className="explore-main">

        <section className="explore-listing-section">

          {/* Search */}
          <div className="explore-search-sort-row">

            <ExploreSearch
              searchInput={searchInput}
              onSearchInputChange={setSearchInput}
              onSearch={handleSearch}
              tourType={selectedTourType}
              onTourTypeChange={setSelectedTourType}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
            />

            <div className="explore-sort-control">

              <label htmlFor="guide-sort">
                Sort by:
              </label>

              <select
                id="guide-sort"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="popular">
                  Most Popular
                </option>

                <option value="rating">
                  Highest Rated
                </option>

                <option value="low-price">
                  Lowest Price
                </option>

                <option value="high-price">
                  Highest Price
                </option>
              </select>

            </div>
          </div>

          {/* Result Header */}
          <div className="explore-listing-header">

            <p>
              Showing{" "}
              <strong>{guides.length}</strong>{" "}
              of{" "}
              <strong>{totalGuides}</strong>{" "}
              guide services
            </p>

            <div className="explore-view-buttons">

              <button
                type="button"
                className={
                  viewMode === "grid" ? "active" : ""
                }
                onClick={() => setViewMode("grid")}
              >
                ▦
              </button>

              <button
                type="button"
                className={
                  viewMode === "list" ? "active" : ""
                }
                onClick={() => setViewMode("list")}
              >
                ☷
              </button>

            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="explore-no-results">
              <h3>{error}</h3>
              <p>Please try again.</p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="explore-no-results">
              <h3>Loading guide services...</h3>
            </div>
          )}

          {/* Cards */}
          {!loading && !error && (
            guides.length > 0 ? (

              <div
                className={
                  viewMode === "list"
                    ? "explore-guide-grid explore-guide-list"
                    : "explore-guide-grid"
                }
              >

                {guides.map((guide) => (
                  <GuideCard
                    key={guide.id}
                    guide={guide}
                  />
                ))}

              </div>

            ) : (

              <div className="explore-no-results">

                <h3>
                  No guide companies found
                </h3>

                <p>
                  Try another destination, price range,
                  or tour type.
                </p>

              </div>
            )
          )}

          {/* Pagination */}
          {!loading && lastPage > 1 && (
            <div className="explore-pagination">

              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                  handlePageChange(currentPage - 1)
                }
              >
                Previous
              </button>

              {Array.from(
                { length: lastPage },
                (_, index) => index + 1
              ).map((page) => (

                <button
                  key={page}
                  type="button"
                  className={
                    currentPage === page
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    handlePageChange(page)
                  }
                >
                  {page}
                </button>

              ))}

              <button
                type="button"
                disabled={currentPage === lastPage}
                onClick={() =>
                  handlePageChange(currentPage + 1)
                }
              >
                Next
              </button>

            </div>
          )}

        </section>
      </main>
    </div>
  );
}

export default Explore;