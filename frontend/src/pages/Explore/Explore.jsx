import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { API_BASE_URL, STORAGE_URL } from "../../config.js";
import GuideLocationMap from "../../components/GuideLocationMap";
import { getLoggedInUser, getToken } from "../../utils/auth.js";
import { getExperienceAsset } from "../../experienceAssets";

import "./Explore.css";
import ExploreHero from "./ExploreHero";
import ExploreSearch from "./ExploreSearch";

function ExperiencePhoto({ experience }) {
  const fallbackImage = getExperienceAsset(experience?.title || "");

  const [imageSource, setImageSource] = useState(
    experience?.photo ? "uploaded" : "fallback",
  );

  const source =
    imageSource === "uploaded"
      ? `${STORAGE_URL}/${experience?.photo}`
      : fallbackImage;

  if (!source || imageSource === "unavailable") {
    return <div className="experience-placeholder">📷</div>;
  }

  return (
    <img
      src={source}
      alt={experience?.title || "Experience"}
      onError={() =>
        setImageSource(
          imageSource === "uploaded" && fallbackImage
            ? "fallback"
            : "unavailable",
        )
      }
    />
  );
}

function formatPriceRange(guide) {
  const minimum = Number(
    guide?.min_price ?? guide?.minPrice ?? guide?.price ?? 0,
  );

  const maximum = Number(
    guide?.max_price ?? guide?.maxPrice ?? guide?.price ?? minimum,
  );

  const min = minimum.toLocaleString();
  const max = maximum.toLocaleString();

  return minimum === maximum ? `৳${min}` : `৳${min} - ৳${max}`;
}

function GuideCard({ guide, onSendRequest, onViewDetails }) {
  return (
    <article className="explore-guide-card">
      <div className="explore-card-content">
        <div className="explore-company-heading">
          <div className="explore-company-logo">
            {guide.companyName
              ? guide.companyName.charAt(0).toUpperCase()
              : "G"}
          </div>

          <div className="explore-company-title">
            <h3>{guide.companyName || "Guide Company"}</h3>

            <p className="explore-location">{guide.location || "Bangladesh"}</p>
          </div>
        </div>

        {guide.tourTypes?.length > 0 && (
          <div className="explore-tour-badges">
            {guide.tourTypes.map((type, index) => (
              <span className="explore-tour-badge" key={`${type}-${index}`}>
                {type}
              </span>
            ))}
          </div>
        )}

        <p className="explore-guide-description">
          {guide.description ||
            "Explore Bangladesh with experienced local guides and discover memorable destinations."}
        </p>

        {guide.experiences?.length > 0 && (
          <div className="explore-experiences">
            <div className="experience-heading">
              <h4>Experiences</h4>
              <span>{guide.experiences.length}</span>
            </div>

            {guide.experiences.slice(0, 2).map((experience) => (
              <div className="experience-item" key={experience.id}>
                <ExperiencePhoto experience={experience} />

                <div className="experience-text">
                  <strong>{experience.title || "Tour Experience"}</strong>

                  <p>
                    {experience.description ||
                      "Discover amazing places and local experiences."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="explore-guide-meta">
          <div className="explore-rating">
            <span className="explore-star">★</span>

            <strong>{Number(guide.rating || 0).toFixed(1)}</strong>

            <span>({guide.reviews || 0} reviews)</span>
          </div>

          <div className="explore-price">
            <span>Price range</span>

            <strong>{formatPriceRange(guide)}</strong>
          </div>
        </div>

        <div className="explore-card-actions">
          <button
            type="button"
            className="explore-secondary-button"
            onClick={() => onViewDetails(guide)}
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

function normalizeGuide(guide) {
  return {
    ...guide,

    id:
      guide.id ??
      guide.guide_profile_id ??
      guide.user_id ??
      crypto.randomUUID(),

    companyName:
      guide.company_name || guide.companyName || guide.business_name || "",

    description: guide.bio || guide.description || "",

    location: guide.address || guide.location || "",

    tourTypes: guide.tour_types || guide.tourTypes || [],

    tourServices: guide.tour_services || guide.tourServices || [],

    min_price: guide.min_price ?? guide.price ?? 0,

    max_price: guide.max_price ?? guide.min_price ?? guide.price ?? 0,

    price: guide.min_price ?? guide.price ?? 0,
  };
}

function hasCoordinates(guide) {
  const latitude = Number(guide?.latitude);
  const longitude = Number(guide?.longitude);

  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

function Explore({ embedded = false }) {
  const navigate = useNavigate();

  const latestFetchId = useRef(0);

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedTourType, setSelectedTourType] = useState("");

  const [searchTourType, setSearchTourType] = useState("");

  const [priceRange, setPriceRange] = useState("");

  const [searchPriceRange, setSearchPriceRange] = useState("");

  const [sortBy, setSortBy] = useState("popular");

  const [sortInput, setSortInput] = useState("");

  const [viewMode, setViewMode] = useState("grid");

  const [guides, setGuides] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [lastPage, setLastPage] = useState(1);

  const [totalGuides, setTotalGuides] = useState(0);

  const [selectedGuide, setSelectedGuide] = useState(null);

  const [selectedService, setSelectedService] = useState(null);

  const [detailsGuide, setDetailsGuide] = useState(null);

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  const [destination, setDestination] = useState("");

  const [travelers, setTravelers] = useState(1);

  const [agreedAmount, setAgreedAmount] = useState("");

  const [selectedExperience, setSelectedExperience] = useState("");

  const [requestLoading, setRequestLoading] = useState(false);

  const [requestSuccess, setRequestSuccess] = useState("");

  const [requestError, setRequestError] = useState("");

  const requestAmount = selectedService
    ? Number(selectedService.price || 0)
    : Number(agreedAmount || 0);

  const mapMarkers = useMemo(() => guides.filter(hasCoordinates), [guides]);

  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const fetchGuides = async (page = 1, filters = {}) => {
    const {
      search = searchTerm,
      tourType = searchTourType,
      price = searchPriceRange,
      sort = sortBy,
    } = filters;

    const requestId = ++latestFetchId.current;

    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search) {
        params.append("search", search);
      }

      if (tourType) {
        params.append("tour_type", tourType);
      }

      if (price) {
        params.append("price_range", price);
      }

      if (sort) {
        params.append("sort", sort);
      }

      params.append("page", String(page));
      params.append("per_page", "6");

      const response = await fetch(
        `${API_BASE_URL}/guides/explore?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      if (requestId !== latestFetchId.current) {
        return;
      }

      setGuides((data.data || []).map(normalizeGuide));

      setCurrentPage(data.current_page || 1);

      setLastPage(data.last_page || 1);

      setTotalGuides(data.total || 0);
    } catch (err) {
      console.error("Explore fetch error:", err);

      if (requestId !== latestFetchId.current) {
        return;
      }

      setError("Unable to load guide services.");

      setGuides([]);
    } finally {
      if (requestId === latestFetchId.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchGuides(1);

    // Initial load only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    const newSearch = searchInput.trim().toLowerCase();

    setSearchTerm(newSearch);

    setSearchTourType(selectedTourType);

    setSearchPriceRange(priceRange);

    setCurrentPage(1);

    fetchGuides(1, {
      search: newSearch,
      tourType: selectedTourType,
      price: priceRange,
      sort: sortBy,
    });
  };

  const handleSortApply = () => {
    const typedValue = sortInput.trim().toLowerCase();

    let nextSort = "popular";

    if (typedValue === "highest rated") {
      nextSort = "rating";
    } else if (typedValue === "lowest rated") {
      nextSort = "low-rating";
    } else if (typedValue === "") {
      nextSort = "popular";
    } else {
      return;
    }

    setSortBy(nextSort);

    setCurrentPage(1);

    fetchGuides(1, {
      search: searchTerm,
      tourType: searchTourType,
      price: searchPriceRange,
      sort: nextSort,
    });
  };

  const handleSortKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSortApply();
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > lastPage) {
      return;
    }

    setCurrentPage(page);

    fetchGuides(page, {
      search: searchTerm,
      tourType: searchTourType,
      price: searchPriceRange,
      sort: sortBy,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleOpenRequest = (guide, service = null) => {
    const user = getLoggedInUser();

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "tourist") {
      if (user.role === "guide") {
        navigate("/guide-dashboard");
      } else {
        navigate("/login");
      }

      return;
    }

    setSelectedGuide(guide);
    setSelectedService(service);

    setFromDate("");
    setToDate("");
    setDestination(service?.location || "");
    setTravelers(1);
    setAgreedAmount(guide.min_price ?? guide.price ?? "");
    setAgreedAmount(guide.min_price ?? guide.price ?? "");

    setSelectedExperience(service?.title || "");

    setRequestSuccess("");
    setRequestError("");
  };

  const handleSelectService = (serviceId) => {
    const service =
      selectedGuide?.tourServices?.find(
        (item) => String(item.id) === serviceId,
      ) || null;

    setSelectedService(service);
    setDestination(service?.location || "");
    setSelectedExperience(service?.title || "");
    setAgreedAmount(
      service
        ? service.price
        : (selectedGuide?.min_price ?? selectedGuide?.price ?? ""),
    );
    const packageTravelerCount = Number(service?.max_travelers);
    setTravelers(
      service &&
        Number.isInteger(packageTravelerCount) &&
        packageTravelerCount > 0
        ? packageTravelerCount
        : 1,
    );
    setFromDate("");
    setToDate("");
    setRequestError("");
  };

  const handleCloseRequest = () => {
    if (requestLoading) {
      return;
    }

    setSelectedGuide(null);
    setSelectedService(null);

    setFromDate("");
    setToDate("");
    setDestination("");
    setTravelers(1);
    setAgreedAmount("");
    setAgreedAmount("");

    setSelectedExperience("");

    setRequestSuccess("");
    setRequestError("");
  };

  const handleCloseDetails = () => {
    setDetailsGuide(null);
  };

  const handleSubmitRequest = async (event) => {
    event.preventDefault();

    setRequestError("");
    setRequestSuccess("");

    const user = getLoggedInUser();

    const token = getToken();

    if (!user || !token) {
      setRequestError("Please login first to send a travel request.");

      setTimeout(() => {
        navigate("/login");
      }, 800);

      return;
    }

    if (user.role !== "tourist") {
      setRequestError("Only tourists can send travel requests.");

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
      setRequestError("Please enter at least 1 traveler.");

      return;
    }

    const minimumAmount = Number(
      selectedGuide.min_price ?? selectedGuide.price ?? 0,
    );

    const maximumAmount = Number(
      selectedGuide.max_price ??
        selectedGuide.min_price ??
        selectedGuide.price ??
        minimumAmount,
    );

    const requestedAmount = requestAmount;

    if (
      (!selectedService && !agreedAmount) ||
      !Number.isFinite(requestedAmount)
    ) {
      setRequestError("Please enter the agreed amount.");

      return;
    }

    if (
      !selectedService &&
      (requestedAmount < minimumAmount || requestedAmount > maximumAmount)
    ) {
      setRequestError(
        `Amount must be between ৳${minimumAmount.toLocaleString()} and ৳${maximumAmount.toLocaleString()}.`,
      );

      return;
    }

    if (
      selectedService &&
      Number(travelers) > Number(selectedService.max_travelers)
    ) {
      setRequestError(
        `This service allows up to ${selectedService.max_travelers} travelers.`,
      );
      return;
    }

    if (!fromDate) {
      setRequestError("Please select a From Date.");

      return;
    }

    if (!toDate) {
      setRequestError("Please select a To Date.");

      return;
    }

    if (toDate < fromDate) {
      setRequestError("To Date cannot be earlier than From Date.");

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

    const requestData = selectedService
      ? {
          guide_profile_id: Number(guideProfileId),
          tour_service_id: selectedService.id,
          travelers: Number(travelers),
          from_date: fromDate,
          to_date: toDate,
        }
      : {
          guide_profile_id: Number(guideProfileId),

          guide_experience_id: null,

          experience_name: selectedExperience.trim() || null,

          destination: destination.trim(),

          travelers: Number(travelers),

          from_date: fromDate,

          to_date: toDate,

          amount: requestedAmount,

          request_details: null,
        };

    try {
      setRequestLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/${selectedService ? "service-requests" : "travel-requests"}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Accept: "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(requestData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Send request error:", data);

        if (data.errors) {
          const firstError = Object.values(data.errors)[0];

          setRequestError(
            Array.isArray(firstError) ? firstError[0] : "Validation error.",
          );
        } else {
          setRequestError(data.message || "Failed to send travel request.");
        }

        return;
      }

      setRequestSuccess("Travel request sent successfully!");

      setFromDate("");
      setToDate("");
      setDestination("");
      setTravelers(1);
      setAgreedAmount("");
      setSelectedExperience("");
    } catch (err) {
      console.error("Send request error:", err);

      setRequestError("Unable to send request. Please try again.");
    } finally {
      setRequestLoading(false);
    }
  };

  return (
    <div
      className={`explore-page${
        viewMode === "map" ? " explore-page--map" : ""
      }`}
    >
      <ExploreHero showNavbar={!embedded} />

      <main className="explore-main">
        <section className="explore-listing-section">
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
              <label htmlFor="guide-sort">Sort by:</label>

              <input
                id="guide-sort"
                type="text"
                value={sortInput}
                onChange={(event) => setSortInput(event.target.value)}
                onKeyDown={handleSortKeyDown}
                placeholder="Highest Rated, Lowest Rated"
                autoComplete="off"
              />

              <button
                type="button"
                className="explore-sort-button"
                onClick={handleSortApply}
              >
                Sort
              </button>
            </div>
          </div>

          <div className="explore-listing-header">
            <p>
              Showing <strong>{guides.length}</strong> of{" "}
              <strong>{totalGuides}</strong> guide services
            </p>

            <div className="explore-view-buttons">
              <button
                type="button"
                className={viewMode === "grid" ? "active" : ""}
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
              >
                ▦
              </button>

              <button
                type="button"
                className={viewMode === "list" ? "active" : ""}
                onClick={() => setViewMode("list")}
                aria-label="List view"
              >
                ☷
              </button>

              <button
                type="button"
                className={`explore-map-toggle${
                  viewMode === "map" ? " active" : ""
                }`}
                onClick={() => setViewMode("map")}
                aria-label="Map view"
                aria-pressed={viewMode === "map"}
                title="Map view"
              >
                <MapPin size={17} aria-hidden="true" />

                <span>Map</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="explore-no-results">
              <h3>{error}</h3>
              <p>Please try again.</p>
            </div>
          )}

          {loading && (
            <div className="explore-no-results">
              <div className="explore-loader" />

              <h3>Loading guide services...</h3>
            </div>
          )}

          {!loading &&
            !error &&
            (guides.length > 0 ? (
              viewMode === "map" ? (
                <div className="explore-map-view">
                  <aside className="explore-map-results">
                    <div className="explore-map-results-header">
                      <strong>Guide services</strong>

                      <span>{guides.length} results</span>
                    </div>

                    <div className="explore-map-guide-list">
                      {guides.map((guide) => (
                        <button
                          type="button"
                          className="explore-map-guide-item"
                          key={guide.id}
                          onClick={() => setDetailsGuide(guide)}
                        >
                          <span className="explore-map-guide-avatar">
                            {guide.companyName?.charAt(0).toUpperCase() || "G"}
                          </span>

                          <span className="explore-map-guide-copy">
                            <strong>
                              {guide.companyName || "Guide Company"}
                            </strong>

                            <small>
                              {guide.location || "Location not added"}
                            </small>

                            <span>{guide.tourTypes?.[0] || "Local guide"}</span>
                          </span>

                          <MapPin
                            className={
                              hasCoordinates(guide)
                                ? "has-map-pin"
                                : "no-map-pin"
                            }
                            size={16}
                            aria-label={
                              hasCoordinates(guide)
                                ? "Location shown on map"
                                : "No map location"
                            }
                          />
                        </button>
                      ))}
                    </div>

                    {mapMarkers.length === 0 && (
                      <p className="explore-map-empty">
                        No guide locations have been pinned yet.
                      </p>
                    )}
                  </aside>

                  <div className="explore-map-canvas">
                    <GuideLocationMap
                      markers={mapMarkers}
                      onMarkerSelect={setDetailsGuide}
                    />
                  </div>
                </div>
              ) : (
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
                      onViewDetails={setDetailsGuide}
                    />
                  ))}
                </div>
              )
            ) : (
              <div className="explore-no-results">
                <h3>No guide companies found</h3>

                <p>Try another destination, price range, or tour type.</p>
              </div>
            ))}

          {!loading && lastPage > 1 && (
            <div className="explore-pagination">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>

              {Array.from(
                {
                  length: lastPage,
                },
                (_, index) => index + 1,
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  className={currentPage === page ? "active" : ""}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === lastPage}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </section>
      </main>

      {detailsGuide && (
        <div className="request-modal-overlay" onClick={handleCloseDetails}>
          <div
            className="request-modal guide-details-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="request-modal-header">
              <div className="request-modal-heading">
                <div className="request-modal-icon">▣</div>

                <div>
                  <h2>{detailsGuide.companyName || "Guide Company"}</h2>

                  <p>{detailsGuide.location || "Bangladesh"}</p>
                </div>
              </div>

              <button
                type="button"
                className="request-modal-close"
                onClick={handleCloseDetails}
                aria-label="Close guide details"
              >
                ×
              </button>
            </div>

            <div className="guide-details-content">
              <p className="guide-details-description">
                {detailsGuide.description ||
                  "Explore Bangladesh with experienced local guides and discover memorable destinations."}
              </p>

              <div className="guide-details-summary">
                <span>★ {Number(detailsGuide.rating || 0).toFixed(1)}</span>

                <span>{detailsGuide.reviews || 0} reviews</span>

                <strong>{formatPriceRange(detailsGuide)}</strong>
              </div>

              <div className="guide-details-experiences">
                <div className="experience-heading">
                  <h4>All Experiences</h4>

                  <span>{detailsGuide.experiences?.length || 0}</span>
                </div>

                {detailsGuide.experiences?.length ? (
                  detailsGuide.experiences.map((experience) => (
                    <article
                      className="guide-details-experience"
                      key={experience.id}
                    >
                      <ExperiencePhoto experience={experience} />

                      <div>
                        <strong>{experience.title || "Tour Experience"}</strong>

                        <p>
                          {experience.description ||
                            "Discover amazing places and local experiences."}
                        </p>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="guide-details-empty">
                    No completed experiences have been added yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedGuide && (
        <div className="request-modal-overlay" onClick={handleCloseRequest}>
          <div
            className="request-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="request-modal-header">
              <div className="request-modal-heading">
                <div className="request-modal-icon">✈</div>

                <div>
                  <h2>Send Travel Request</h2>

                  <p>
                    Request{" "}
                    {selectedExperience ? (
                      <strong>{selectedExperience}</strong>
                    ) : (
                      "a tour"
                    )}{" "}
                    from{" "}
                    <strong>
                      {selectedGuide.companyName || "Guide Company"}
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

            {requestSuccess && (
              <div className="request-success-wrapper">
                <div className="request-success-message">
                  <div className="success-icon">✓</div>

                  <div>
                    <strong>Request Sent Successfully!</strong>

                    <p>
                      Your travel request has been sent to{" "}
                      {selectedGuide.companyName || "the guide"}.
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

            {requestError && (
              <div className="request-error-message">
                <span>!</span>
                {requestError}
              </div>
            )}

            {!requestSuccess && (
              <form
                onSubmit={handleSubmitRequest}
                className="travel-request-form"
              >
                <div className="request-guide-info">
                  <div className="request-guide-avatar">
                    {selectedGuide.companyName
                      ? selectedGuide.companyName.charAt(0).toUpperCase()
                      : "G"}
                  </div>

                  <div className="request-guide-details">
                    <span className="request-guide-label">
                      Your selected guide
                    </span>

                    <strong>
                      {selectedGuide.companyName || "Guide Company"}
                    </strong>

                    <span className="request-guide-price">
                      {selectedService ? (
                        `Price per traveler: ৳${Number(selectedService.price).toLocaleString()}`
                      ) : (
                        <>Price range: {formatPriceRange(selectedGuide)}</>
                      )}
                    </span>
                  </div>
                </div>

                {selectedGuide.tourServices?.length > 0 && (
                  <div className="request-form-group request-package-group">
                    <label>Tour Package (Optional)</label>

                    <div
                      className="request-package-options"
                      role="listbox"
                      aria-label="Tour packages"
                    >
                      <button
                        type="button"
                        className={`request-package-option ${!selectedService ? "is-selected" : ""}`}
                        onClick={() => handleSelectService("")}
                      >
                        <span className="request-package-option__title">
                          No package - fill in manually
                        </span>
                      </button>

                      {selectedGuide.tourServices.map((service) => (
                        <button
                          key={service.id}
                          type="button"
                          className={`request-package-option ${selectedService?.id === service.id ? "is-selected" : ""}`}
                          onClick={() =>
                            handleSelectService(String(service.id))
                          }
                        >
                          <span className="request-package-option__title">
                            {service.title}
                          </span>
                          <span className="request-package-option__meta">
                            {service.location}
                          </span>
                          <span className="request-package-option__price">
                            ৳{Number(service.price).toLocaleString()}
                          </span>
                        </button>
                      ))}
                    </div>

                    <small>
                      Select a package to view its details, or keep manual
                      entry.
                    </small>
                  </div>
                )}

                {selectedService && (
                  <section
                    className="request-package-details"
                    aria-live="polite"
                  >
                    <div className="request-package-photo">
                      <ExperiencePhoto
                        experience={{
                          title: selectedService.title,
                          photo: selectedService.image,
                        }}
                      />
                    </div>
                    <div className="request-package-details-heading">
                      <h3>{selectedService.title}</h3>
                      <span>
                        ৳{Number(selectedService.price).toLocaleString()} /
                        person
                      </span>
                    </div>
                    <p>{selectedService.description}</p>
                    <dl>
                      <div>
                        <dt>Destination</dt>
                        <dd>{selectedService.location}</dd>
                      </div>
                      <div>
                        <dt>Tour type</dt>
                        <dd>{selectedService.tour_type}</dd>
                      </div>
                      <div>
                        <dt>Duration</dt>
                        <dd>{selectedService.duration}</dd>
                      </div>
                      <div>
                        <dt>Group limit</dt>
                        <dd>Up to {selectedService.max_travelers} travelers</dd>
                      </div>
                    </dl>
                  </section>
                )}

                <div className="request-form-group">
                  <label htmlFor="agreed-amount">
                    {selectedService
                      ? "Package Amount (৳)"
                      : "Agreed Amount (৳)"}
                  </label>

                  <div className="request-input-wrapper">
                    <span className="request-input-icon">৳</span>

                    <input
                      id="agreed-amount"
                      type="number"
                      min={
                        selectedService
                          ? undefined
                          : (selectedGuide.min_price ??
                            selectedGuide.price ??
                            0)
                      }
                      max={
                        selectedService
                          ? undefined
                          : (selectedGuide.max_price ??
                            selectedGuide.min_price ??
                            selectedGuide.price ??
                            0)
                      }
                      value={selectedService ? requestAmount : agreedAmount}
                      readOnly={Boolean(selectedService)}
                      onChange={(event) => setAgreedAmount(event.target.value)}
                      placeholder="Enter agreed amount"
                      required
                    />
                  </div>

                  <small>
                    {selectedService ? (
                      "Fixed package price; it does not change with traveler count."
                    ) : (
                      <>
                        Enter an amount between{" "}
                        {formatPriceRange(selectedGuide)}.
                      </>
                    )}
                  </small>
                </div>

                <div className="request-form-group request-experience-group">
                  <label htmlFor="experience">Which Tour / Experience?</label>

                  <div className="request-input-wrapper">
                    <span className="request-input-icon">🗺️</span>

                    <input
                      id="experience"
                      type="text"
                      value={selectedExperience}
                      readOnly={Boolean(selectedService)}
                      onChange={(event) =>
                        setSelectedExperience(event.target.value)
                      }
                      placeholder="Enter tour experience"
                      maxLength={255}
                    />
                  </div>

                  <small>Enter your preferred tour experience.</small>
                </div>

                <div className="request-form-group">
                  <label htmlFor="destination">Destination</label>

                  <div className="request-input-wrapper">
                    <span className="request-input-icon">📍</span>

                    <input
                      id="destination"
                      type="text"
                      value={destination}
                      onChange={(event) => setDestination(event.target.value)}
                      readOnly={Boolean(selectedService)}
                      placeholder="Where do you want to travel?"
                      maxLength={255}
                      required
                    />
                  </div>

                  <small>Enter the destination you want to visit.</small>
                </div>

                <div className="request-form-group">
                  <label htmlFor="travelers">Number of Travelers</label>

                  <div className="request-input-wrapper">
                    <span className="request-input-icon">👥</span>

                    <input
                      id="travelers"
                      type="number"
                      min="1"
                      max={selectedService?.max_travelers || 100}
                      value={travelers}
                      readOnly={Boolean(selectedService)}
                      onChange={(event) => setTravelers(event.target.value)}
                      placeholder="Number of travelers"
                      required
                    />
                  </div>

                  <small>
                    {selectedService
                      ? `Package group size: ${travelers} travelers. Package price updates automatically.`
                      : "Enter the total number of people joining the tour."}
                  </small>
                </div>

                <div className="request-date-range">
                  <div className="request-form-group">
                    <label htmlFor="from-date">From Date</label>

                    <div className="request-input-wrapper">
                      <span className="request-input-icon">📅</span>

                      <input
                        id="from-date"
                        type="date"
                        value={fromDate}
                        min={getTodayDate()}
                        onChange={(event) => {
                          const value = event.target.value;

                          setFromDate(value);

                          if (toDate && value > toDate) {
                            setToDate("");
                          }
                        }}
                        required
                      />
                    </div>

                    <small>Select your starting travel date.</small>
                  </div>

                  <div className="request-form-group">
                    <label htmlFor="to-date">To Date</label>

                    <div className="request-input-wrapper">
                      <span className="request-input-icon">📅</span>

                      <input
                        id="to-date"
                        type="date"
                        value={toDate}
                        min={fromDate || getTodayDate()}
                        onChange={(event) => setToDate(event.target.value)}
                        required
                      />
                    </div>

                    <small>Select your ending travel date.</small>
                  </div>
                </div>

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
                        <span className="button-spinner" />
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
