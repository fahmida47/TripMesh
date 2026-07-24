import { useState } from "react";
import "./Explore.css";

import ExploreHero from "./ExploreHero";
import ExploreSearch from "./ExploreSearch";

import dhakaImage from "../../assets/dhaka.jpg";
import dhakaCityImage from "../../assets/dhaka-city.jpg";
import coxsBazarImage from "../../assets/coxsbazar.jpg";
import sundarbansImage from "../../assets/sundarbans.jpg";
import sylhetImage from "../../assets/sylhet.jpg";
import paharpurImage from "../../assets/paharpur.jpg";

const locations = [
  { id: 1, name: "All Locations", count: null },
  { id: 2, name: "Dhaka", count: 24 },
  { id: 3, name: "Cox's Bazar", count: 18 },
  { id: 4, name: "Sylhet", count: 16 },
  { id: 5, name: "Sundarbans", count: 12 },
  { id: 6, name: "Bandarban", count: 14 },
  { id: 7, name: "Paharpur", count: 9 },
];

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

function TourTypeBadge({ type }) {
  const badgeClass = type.toLowerCase().replaceAll(" ", "-");

  return (
    <span className={`explore-tour-badge ${badgeClass}`}>
      {type}
    </span>
  );
}

function GuideCard({ guide }) {
  return (
    <article className="explore-guide-card">
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

      <div className="explore-guide-content">
        <div className="explore-company-heading">
          <div
            className="explore-company-logo"
            aria-hidden="true"
          >
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

        <div className="explore-tour-badges">
          {guide.tourTypes.map((type) => (
            <TourTypeBadge
              key={type}
              type={type}
            />
          ))}
        </div>

        <p className="explore-guide-description">
          {guide.description}
        </p>

        <div className="explore-guide-meta">
          <div className="explore-rating">
            <span
              className="explore-star"
              aria-hidden="true"
            >
              ★
            </span>

            <strong>{guide.rating}</strong>

            <span>({guide.reviews} reviews)</span>
          </div>

          <div className="explore-price">
            <span>From</span>

            <strong>
              ৳{guide.price.toLocaleString()}
            </strong>
          </div>
        </div>

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

function Explore() {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    setSearchTerm(searchInput.trim().toLowerCase());
  };

  const filteredCompanies = guideCompanies.filter((company) => {
    if (!searchTerm) {
      return true;
    }

    const matchesCompanyName = company.companyName
      .toLowerCase()
      .includes(searchTerm);

    const matchesLocation = company.location
      .toLowerCase()
      .includes(searchTerm);

    const matchesDestination = company.destination
      .toLowerCase()
      .includes(searchTerm);

    const matchesTourType = company.tourTypes.some((tourType) =>
      tourType.toLowerCase().includes(searchTerm),
    );

    return (
      matchesCompanyName ||
      matchesLocation ||
      matchesDestination ||
      matchesTourType
    );
  });

  return (
    <div className="explore-page">
      <ExploreHero />

      <main className="explore-main">
        <aside className="explore-filter-sidebar">
          <div className="explore-filter-header">
            <h2>Filters</h2>

            <button
              type="button"
              className="explore-reset-button"
            >
              ↻ Reset
            </button>
          </div>

          <section className="explore-filter-group">
            <h3>
              <span aria-hidden="true">⌖</span>
              Location
            </h3>

            <div className="explore-filter-options">
              {locations.map((location, index) => (
                <label
                  className="explore-checkbox-label"
                  key={location.id}
                >
                  <input
                    type="checkbox"
                    defaultChecked={index === 0}
                  />

                  <span>
                    {location.name}

                    {location.count !== null
                      ? ` (${location.count})`
                      : ""}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="explore-filter-group">
            <h3>
              <span aria-hidden="true">♧</span>
              Tour Type

              <span className="explore-collapse-icon">
                ⌃
              </span>
            </h3>

            <div className="explore-filter-options">
              {[
                "Group Tour",
                "Dual Tour",
                "Single Tour",
              ].map((tourType) => (
                <label
                  className="explore-checkbox-label"
                  key={tourType}
                >
                  <input type="checkbox" />
                  <span>{tourType}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="explore-filter-group">
            <h3>
              <span aria-hidden="true">◉</span>
              Price Range

              <span className="explore-collapse-icon">
                ⌃
              </span>
            </h3>

            <div className="explore-filter-options">
              <label className="explore-radio-label">
                <input
                  type="radio"
                  name="priceOrder"
                  defaultChecked
                />

                <span>Low to High</span>
              </label>

              <label className="explore-radio-label">
                <input
                  type="radio"
                  name="priceOrder"
                />

                <span>High to Low</span>
              </label>
            </div>
          </section>

          <section className="explore-filter-group">
            <h3>
              <span aria-hidden="true">☆</span>
              Guide Rating

              <span className="explore-collapse-icon">
                ⌃
              </span>
            </h3>

            <div className="explore-filter-options">
              <label className="explore-checkbox-label">
                <input type="checkbox" />
                <span>4 Stars and Above</span>
              </label>

              <label className="explore-checkbox-label">
                <input type="checkbox" />
                <span>3 Stars and Above</span>
              </label>
            </div>
          </section>

          <button
            type="button"
            className="explore-apply-filter-button"
          >
            Apply Filters
          </button>
        </aside>

        <section className="explore-listing-section">
          <div className="explore-search-sort-row">
            <ExploreSearch
              searchInput={searchInput}
              onSearchInputChange={setSearchInput}
              onSearch={handleSearch}
            />

            <div className="explore-sort-control">
              <label htmlFor="guide-sort">
                Sort by:
              </label>

              <select
                id="guide-sort"
                defaultValue="popular"
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

          <div className="explore-listing-header">
            <p>
              Showing{" "}
              <strong>
                {filteredCompanies.length}
              </strong>{" "}
              of{" "}
              <strong>
                {guideCompanies.length}
              </strong>{" "}
              guide services
            </p>

            <div className="explore-view-buttons">
              <button
                type="button"
                className="active"
                aria-label="Grid view"
              >
                ▦
              </button>

              <button
                type="button"
                aria-label="List view"
              >
                ☷
              </button>
            </div>
          </div>

          <div className="explore-guide-grid">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((guide) => (
                <GuideCard
                  key={guide.id}
                  guide={guide}
                />
              ))
            ) : (
              <div className="explore-no-results">
                <h3>No guide companies found</h3>

                <p>
                  Try searching by another company,
                  destination, location, or tour type.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Explore;