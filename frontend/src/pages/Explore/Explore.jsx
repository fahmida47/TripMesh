import { useState } from "react";
import "./Explore.css";

import ExploreHero from "./ExploreHero";
import ExploreSearch from "./ExploreSearch";

import dhakaImage from "../../assets/dhaka.jpg";
import dhakaCityImage from "../../assets/dhaka-city.jpg";
import coxsBazarImage from "../../assets/coxsbazar.jpg";
import sundarbansImage from "../../assets/sundarbans.jpg";
import sylhetImage from "../../assets/sylhet-tea-garden.png";
import paharpurImage from "../../assets/paharpur.jpg";

/* =========================
   MOCK GUIDE DATA
========================= */

const guideCompanies = [
  {
    id: 1,
    companyName: "PathPilot",
    location: "Dhaka",
    destination: "Dhaka Historical Places",
    tourTypes: ["Single Tour", "Dual Tour", "Group Tour"],
    description:
      "Experience the rich history, culture and hidden gems with our expert local guides.",
    rating: 4.8,
    reviews: 120,
    price: 2500,
    popularity: 95,
    image: dhakaImage,
    logoText: "P",
  },

  {
    id: 2,
    companyName: "WanderMate",
    location: "Cox's Bazar",
    destination: "Cox's Bazar Beach",
    tourTypes: ["Single Tour", "Dual Tour", "Group Tour"],
    description:
      "Enjoy the sea breeze and explore the best attractions with our professional local team.",
    rating: 4.7,
    reviews: 98,
    price: 2800,
    popularity: 90,
    image: coxsBazarImage,
    logoText: "W",
  },

  {
    id: 3,
    companyName: "JourneyRoot",
    location: "Sundarbans",
    destination: "Sundarbans Mangrove Forest",
    tourTypes: ["Group Tour"],
    description:
      "Discover the wild side of the Sundarbans with our experienced and trusted guides.",
    rating: 4.9,
    reviews: 145,
    price: 4000,
    popularity: 98,
    image: sundarbansImage,
    logoText: "J",
  },

  {
    id: 4,
    companyName: "Horizon Link",
    location: "Sylhet",
    destination: "Sylhet Tea Gardens",
    tourTypes: ["Single Tour", "Dual Tour", "Group Tour"],
    description:
      "Explore lush tea gardens, waterfalls and the peaceful natural beauty of Sylhet.",
    rating: 4.6,
    reviews: 85,
    price: 2600,
    popularity: 84,
    image: sylhetImage,
    logoText: "H",
  },

  {
    id: 5,
    companyName: "Local Lens",
    location: "Paharpur",
    destination: "Paharpur Heritage Site",
    tourTypes: ["Single Tour", "Dual Tour", "Group Tour"],
    description:
      "Step into history with guided tours of ancient heritage sites and nearby attractions.",
    rating: 4.6,
    reviews: 65,
    price: 2200,
    popularity: 78,
    image: paharpurImage,
    logoText: "L",
  },

  {
    id: 6,
    companyName: "RoamBridge",
    location: "Dhaka",
    destination: "Old Dhaka City",
    tourTypes: ["Single Tour", "Dual Tour", "Group Tour"],
    description:
      "Explore vibrant city life and heritage locations with friendly and knowledgeable guides.",
    rating: 4.8,
    reviews: 110,
    price: 2700,
    popularity: 92,
    image: dhakaCityImage,
    logoText: "R",
  },
];

/* =========================
   TOUR TYPE BADGE
========================= */

function TourTypeBadge({ type }) {
  const badgeClass = type.toLowerCase().replaceAll(" ", "-");

  return <span className={`explore-tour-badge ${badgeClass}`}>{type}</span>;
}

/* =========================
   GUIDE CARD
========================= */

function GuideCard({ guide }) {
  return (
    <article className="explore-guide-card">
      {/* IMAGE */}

      <div className="explore-guide-image-wrapper">
        <img
          className="explore-guide-image"
          src={guide.image}
          alt={`${guide.companyName} guide service in ${guide.location}`}
        />

        <button
          type="button"
          className="explore-favorite-button"
          aria-label={`Add ${guide.companyName} to favorites`}
        >
          ♡
        </button>
      </div>

      {/* CARD CONTENT */}

      <div className="explore-guide-content">
        {/* COMPANY */}

        <div className="explore-company-heading">
          <div className="explore-company-logo" aria-hidden="true">
            {guide.logoText}
          </div>

          <div className="explore-company-title-wrapper">
            <h3>{guide.companyName}</h3>

            <p className="explore-location">
              <span aria-hidden="true">⌖</span>
              {guide.location}
            </p>
          </div>
        </div>

        {/* TOUR TYPES */}

        <div className="explore-tour-badges">
          {guide.tourTypes.map((type) => (
            <TourTypeBadge key={type} type={type} />
          ))}
        </div>

        {/* DESCRIPTION */}

        <p className="explore-guide-description">{guide.description}</p>

        {/* RATING + PRICE */}

        <div className="explore-guide-meta">
          <div className="explore-rating">
            <span className="explore-star" aria-hidden="true">
              ★
            </span>

            <strong>{guide.rating}</strong>

            <span>({guide.reviews} reviews)</span>
          </div>

          <div className="explore-price">
            <span>From</span>

            <strong>৳{guide.price.toLocaleString()}</strong>
          </div>
        </div>

        {/* BUTTONS */}

        <div className="explore-card-actions">
          <button type="button" className="explore-secondary-button">
            View Details
          </button>

          <button type="button" className="explore-primary-button">
            Send Request
          </button>
        </div>
      </div>
    </article>
  );
}

/* =========================
   EXPLORE PAGE
========================= */

function Explore({ embedded = false }) {
  const [searchInput, setSearchInput] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  /* TOUR TYPE */

  const [selectedTourType, setSelectedTourType] = useState("");

  const [searchTourType, setSearchTourType] = useState("");

  /* PRICE RANGE */

  const [priceRange, setPriceRange] = useState("");

  const [searchPriceRange, setSearchPriceRange] = useState("");

  /* SORT */

  const [sortBy, setSortBy] = useState("popular");

  /* GRID / LIST VIEW */

  const [viewMode, setViewMode] = useState("grid");

  /* =========================
     SEARCH
  ========================= */

  const handleSearch = () => {
    setSearchTerm(searchInput.trim().toLowerCase());

    setSearchTourType(selectedTourType);

    setSearchPriceRange(priceRange);
  };

  /* =========================
     FILTER SEARCH RESULTS
  ========================= */

  const filteredCompanies = guideCompanies.filter((company) => {
    /* Destination / company / location */

    const matchesText =
      !searchTerm ||
      company.companyName.toLowerCase().includes(searchTerm) ||
      company.location.toLowerCase().includes(searchTerm) ||
      company.destination.toLowerCase().includes(searchTerm);

    /* Tour Type */

    const matchesTourType =
      !searchTourType || company.tourTypes.includes(searchTourType);

    /* Price Range */

    const matchesPrice =
      !searchPriceRange ||
      (searchPriceRange === "low" &&
        company.price >= 2000 &&
        company.price <= 2500) ||
      (searchPriceRange === "medium" &&
        company.price >= 2501 &&
        company.price <= 3000) ||
      (searchPriceRange === "high" && company.price >= 3001);

    return matchesText && matchesTourType && matchesPrice;
  });

  /* =========================
     SORT
  ========================= */

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    if (sortBy === "rating") {
      return b.rating - a.rating;
    }

    if (sortBy === "low-price") {
      return a.price - b.price;
    }

    if (sortBy === "high-price") {
      return b.price - a.price;
    }

    return b.popularity - a.popularity;
  });

  /* =========================
     PAGE
  ========================= */

  return (
    <div className="explore-page">
      <ExploreHero showNavbar={!embedded} />

      <main className="explore-main explore-main-no-filter">
        <section className="explore-listing-section">
          {/* SEARCH + SORT */}

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

            {/* SORT */}

            <div className="explore-sort-control">
              <label htmlFor="guide-sort">Sort by:</label>

              <select
                id="guide-sort"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="popular">Most Popular</option>

                <option value="rating">Highest Rated</option>

                <option value="low-price">Lowest Price</option>

                <option value="high-price">Highest Price</option>
              </select>
            </div>
          </div>

          {/* RESULT COUNT */}

          <div className="explore-listing-header">
            <p>
              Showing <strong>{sortedCompanies.length}</strong> of{" "}
              <strong>{guideCompanies.length}</strong> guide services
            </p>

            {/* GRID / LIST BUTTON */}

            <div className="explore-view-buttons">
              <button
                type="button"
                className={viewMode === "grid" ? "active" : ""}
                aria-label="Grid view"
                onClick={() => setViewMode("grid")}
              >
                ▦
              </button>

              <button
                type="button"
                className={viewMode === "list" ? "active" : ""}
                aria-label="List view"
                onClick={() => setViewMode("list")}
              >
                ☷
              </button>
            </div>
          </div>

          {/* GUIDE CARDS */}

          <div
            className={`explore-guide-grid ${
              viewMode === "list" ? "explore-guide-list" : ""
            }`}
          >
            {sortedCompanies.length > 0 ? (
              sortedCompanies.map((guide) => (
                <GuideCard key={guide.id} guide={guide} />
              ))
            ) : (
              <div className="explore-no-results">
                <h3>No guide companies found</h3>

                <p>Try another destination, price range, or tour type.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Explore;
