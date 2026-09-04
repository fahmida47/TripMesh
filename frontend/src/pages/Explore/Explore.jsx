import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Explore.css";
import ExploreHero from "./ExploreHero";
import ExploreSearch from "./ExploreSearch";

const API_BASE_URL = "http://127.0.0.1:8000/api";
const STORAGE_URL = "http://127.0.0.1:8000/storage";

function getLoggedInUser() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const storedUser = localStorage.getItem("user");

  if (isLoggedIn !== "true" || !storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Invalid user data:", error);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    return null;
  }
}

function GuideCard({ guide, onSendRequest }) {
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
            <h3>{guide.companyName || "Guide Company"}</h3>

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
        {guide.experiences && guide.experiences.length > 0 && (
          <div className="explore-experiences">
            <div className="experience-heading">
              <h4>Experiences</h4>
              <span>{guide.experiences.length}</span>
            </div>

            {guide.experiences.slice(0, 2).map((experience) => (
              <div className="experience-item" key={experience.id}>
                {experience.photo ? (
                  <img
                    src={`${STORAGE_URL}/${experience.photo}`}
                    alt={experience.title || "Experience"}
                  />
                ) : (
                  <div className="experience-placeholder">📷</div>
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
            onClick={() => onSendRequest(guide)}
          >
            Send Request
          </button>
        </div>
      </div>
    </article>
  );
}

function Explore({ embedded = false }) {
  const navigate = useNavigate();

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

  // Request Modal
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [travelDate, setTravelDate] = useState("");
  const [destination, setDestination] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [requestDetails, setRequestDetails] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState("");
  const [requestError, setRequestError] = useState("");

  // Today's date
  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Fetch Guides
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

  // Search
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

  // Sort
  const handleSortChange = (event) => {
    const value = event.target.value;

    setSortBy(value);
    setCurrentPage(1);

    setTimeout(() => {
      fetchGuides(1);
    }, 0);
  };

  // Pagination
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

  // Open Request
  const handleOpenRequest = (guide) => {
    const user = getLoggedInUser();

    /*
      IMPORTANT:
      Explore page is public.
      Anyone can view guides.
      But only authenticated users can send requests.
    */
    if (!user) {
      navigate("/login");
      return;
    }

    /*
      Only Tourist can send travel requests.
    */
    if (user.role !== "tourist") {
      if (user.role === "guide") {
        navigate("/guide-dashboard");
      } else {
        navigate("/login");
      }

      return;
    }

    setSelectedGuide(guide);
    setTravelDate("");
    setDestination("");
    setTravelers(1);
    setRequestDetails("");
    setSelectedExperience("");
    setRequestSuccess("");
    setRequestError("");
  };

  // Close Request
  const handleCloseRequest = () => {
    if (requestLoading) {
      return;
    }

    setSelectedGuide(null);
    setTravelDate("");
    setDestination("");
    setTravelers(1);
    setRequestDetails("");
    setSelectedExperience("");
    setRequestSuccess("");
    setRequestError("");
  };

  // Submit Travel Request
  const handleSubmitRequest = async (event) => {
    event.preventDefault();

    setRequestError("");
    setRequestSuccess("");

    const user = getLoggedInUser();
    const token = localStorage.getItem("token");

    /*
      Double protection:
      Even if modal somehow opens without authentication,
      request cannot be submitted.
    */
    if (!user || !token) {
      setRequestError(
        "Please login first to send a travel request."
      );

      setTimeout(() => {
        navigate("/login");
      }, 800);

      return;
    }

    if (user.role !== "tourist") {
      setRequestError(
        "Only tourists can send travel requests."
      );

      return;
    }

    if (!selectedGuide) {
      setRequestError("Guide information is missing.");
      return;
    }

    if (!destination.trim()) {
      setRequestError("Please enter your destination.");
      return;
    }

    if (!travelers || Number(travelers) < 1) {
      setRequestError(
        "Please enter at least 1 traveler."
      );

      return;
    }

    if (!travelDate) {
      setRequestError("Please select a travel date.");
      return;
    }

    const guideProfileId =
      selectedGuide.guide_profile_id ||
      selectedGuide.guideProfileId ||
      selectedGuide.id;

    if (!guideProfileId) {
      setRequestError("Guide profile ID is missing.");
      return;
    }

    const experienceId = selectedExperience || null;

    /*
      Data sent to Laravel backend.
    */
    const requestData = {
      guide_profile_id: Number(guideProfileId),

      guide_experience_id: experienceId
        ? Number(experienceId)
        : null,

      destination: destination.trim(),

      travelers: Number(travelers),

      travel_date: travelDate,

      amount: Number(selectedGuide.price || 0),

      request_details:
        requestDetails.trim() || null,
    };

    try {
      setRequestLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/travel-requests`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Send request error:", data);

        if (data.errors) {
          const firstError = Object.values(data.errors)[0];

          setRequestError(
            Array.isArray(firstError)
              ? firstError[0]
              : "Validation error."
          );
        } else {
          setRequestError(
            data.message ||
              "Failed to send travel request."
          );
        }

        return;
      }

      // Success
      setRequestSuccess(
        "Travel request sent successfully!"
      );

      setTravelDate("");
      setDestination("");
      setTravelers(1);
      setRequestDetails("");
      setSelectedExperience("");
    } catch (err) {
      console.error("Send request error:", err);

      setRequestError(
        "Unable to send request. Please try again."
      );
    } finally {
      setRequestLoading(false);
    }
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
              <strong>{guides.length}</strong> of{" "}
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
                aria-label="Grid view"
              >
                ▦
              </button>

              <button
                type="button"
                className={
                  viewMode === "list" ? "active" : ""
                }
                onClick={() => setViewMode("list")}
                aria-label="List view"
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
              <div className="explore-loader"></div>

              <h3>
                Loading guide services...
              </h3>
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
                    onSendRequest={handleOpenRequest}
                  />
                ))}
              </div>
            ) : (
              <div className="explore-no-results">
                <h3>
                  No guide companies found
                </h3>

                <p>
                  Try another destination, price
                  range, or tour type.
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
                disabled={
                  currentPage === lastPage
                }
                onClick={() =>
                  handlePageChange(
                    currentPage + 1
                  )
                }
              >
                Next
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Send Request Modal */}
      {selectedGuide && (
        <div
          className="request-modal-overlay"
          onClick={handleCloseRequest}
        >
          <div
            className="request-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* Modal Header */}
            <div className="request-modal-header">
              <div className="request-modal-heading">
                <div className="request-modal-icon">
                  ✈
                </div>

                <div>
                  <h2>
                    Send Travel Request
                  </h2>

                  <p>
                    Request a tour from{" "}
                    <strong>
                      {selectedGuide.companyName ||
                        "Guide Company"}
                    </strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="request-modal-close"
                onClick={handleCloseRequest}
                disabled={requestLoading}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Success */}
            {requestSuccess && (
              <div className="request-success-wrapper">
                <div className="request-success-message">
                  <div className="success-icon">
                    ✓
                  </div>

                  <div>
                    <strong>
                      Request Sent Successfully!
                    </strong>

                    <p>
                      Your travel request has
                      been sent to{" "}
                      {selectedGuide.companyName ||
                        "the guide"}.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="request-done-button"
                  onClick={handleCloseRequest}
                >
                  Done
                </button>
              </div>
            )}

            {/* Error */}
            {requestError && (
              <div className="request-error-message">
                <span>!</span>
                {requestError}
              </div>
            )}

            {/* Form */}
            {!requestSuccess && (
              <form
                onSubmit={handleSubmitRequest}
                className="travel-request-form"
              >
                {/* Guide Info */}
                <div className="request-guide-info">
                  <div className="request-guide-avatar">
                    {selectedGuide.companyName
                      ? selectedGuide.companyName
                          .charAt(0)
                          .toUpperCase()
                      : "G"}
                  </div>

                  <div className="request-guide-details">
                    <span className="request-guide-label">
                      Your selected guide
                    </span>

                    <strong>
                      {selectedGuide.companyName ||
                        "Guide Company"}
                    </strong>

                    <span className="request-guide-price">
                      Starting from ৳
                      {Number(
                        selectedGuide.price || 0
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Experience */}
                {selectedGuide.experiences &&
                  selectedGuide.experiences.length >
                    0 && (
                    <div className="request-form-group">
                      <label htmlFor="experience">
                        Tour / Experience
                      </label>

                      <div className="request-input-wrapper">
                        <span className="request-input-icon">
                          🗺
                        </span>

                        <select
                          id="experience"
                          value={selectedExperience}
                          onChange={(event) =>
                            setSelectedExperience(
                              event.target.value
                            )
                          }
                        >
                          <option value="">
                            General Tour
                          </option>

                          {selectedGuide.experiences.map(
                            (experience) => (
                              <option
                                key={experience.id}
                                value={experience.id}
                              >
                                {experience.title ||
                                  "Tour Experience"}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                  )}

                {/* Destination */}
                <div className="request-form-group">
                  <label htmlFor="destination">
                    Destination
                  </label>

                  <div className="request-input-wrapper">
                    <span className="request-input-icon">
                      📍
                    </span>

                    <input
                      id="destination"
                      type="text"
                      value={destination}
                      onChange={(event) =>
                        setDestination(
                          event.target.value
                        )
                      }
                      placeholder="Where do you want to travel?"
                      maxLength={255}
                      required
                    />
                  </div>

                  <small>
                    Enter the destination you want to
                    visit.
                  </small>
                </div>

                {/* Travelers */}
                <div className="request-form-group">
                  <label htmlFor="travelers">
                    Number of Travelers
                  </label>

                  <div className="request-input-wrapper">
                    <span className="request-input-icon">
                      👥
                    </span>

                    <input
                      id="travelers"
                      type="number"
                      min="1"
                      max="100"
                      value={travelers}
                      onChange={(event) =>
                        setTravelers(
                          event.target.value
                        )
                      }
                      placeholder="Number of travelers"
                      required
                    />
                  </div>

                  <small>
                    Enter the total number of people
                    joining the tour.
                  </small>
                </div>

                {/* Travel Date */}
                <div className="request-form-group">
                  <label htmlFor="travel-date">
                    Travel Date
                  </label>

                  <div className="request-input-wrapper">
                    <span className="request-input-icon">
                      📅
                    </span>

                    <input
                      id="travel-date"
                      type="date"
                      value={travelDate}
                      min={getTodayDate()}
                      onChange={(event) =>
                        setTravelDate(
                          event.target.value
                        )
                      }
                      required
                    />
                  </div>

                  <small>
                    Choose your preferred travel date.
                  </small>
                </div>

                {/* Request Details */}
                <div className="request-form-group">
                  <div className="request-label-row">
                    <label htmlFor="request-details">
                      Request Details
                    </label>

                    <span>Optional</span>
                  </div>

                  <textarea
                    id="request-details"
                    value={requestDetails}
                    onChange={(event) =>
                      setRequestDetails(
                        event.target.value
                      )
                    }
                    placeholder="Tell the guide about your preferences or any special requirements."
                    maxLength={2000}
                    rows={5}
                  />

                  <small className="request-character-count">
                    {requestDetails.length}/2000
                  </small>
                </div>

                {/* Amount */}
                <div className="request-amount-box">
                  <div>
                    <span>
                      Estimated Amount
                    </span>

                    <small>
                      Final price may vary based on
                      your request.
                    </small>
                  </div>

                  <strong>
                    ৳
                    {Number(
                      selectedGuide.price || 0
                    ).toLocaleString()}
                  </strong>
                </div>

                {/* Actions */}
                <div className="request-form-actions">
                  <button
                    type="button"
                    className="request-cancel-button"
                    onClick={handleCloseRequest}
                    disabled={requestLoading}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="request-submit-button"
                    disabled={requestLoading}
                  >
                    {requestLoading ? (
                      <>
                        <span className="button-spinner"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Request
                        <span>→</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Explore;