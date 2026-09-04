import { useMemo } from "react";
import { FiMapPin, FiStar, FiShield } from "react-icons/fi";
import { logoColor } from "../mockRequestsBookings";

function formatMoney(value) {
  if (value === undefined || value === null || value === "") {
    return "—";
  }

  return `৳${Number(value).toLocaleString()}`;
}

function formatDisplayDate(date) {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function PaymentBookingSummary({ booking }) {
  const summary = useMemo(() => {
    if (!booking) {
      return null;
    }

    const experience = booking.experience || {};

    const travelRequest =
      booking.travelRequest ||
      booking.travel_request ||
      {};

    const guideProfile =
      booking.guide ||
      booking.guide_profile ||
      {};

    const tourType =
      experience.title ||
      experience.name ||
      experience.experience_name ||
      experience.experience_title ||
      booking.tourTitle ||
      booking.tour_title ||
      booking.tourName ||
      booking.tour_name ||
      travelRequest.title ||
      travelRequest.tour_title ||
      "—";

    const destination =
      experience.destination ||
      experience.location ||
      experience.destination_name ||
      travelRequest.destination ||
      travelRequest.destination_name ||
      travelRequest.location ||
      booking.destination ||
      booking.destination_name ||
      booking.location ||
      "—";

    const companyName =
      guideProfile.company_name ||
      guideProfile.companyName ||
      guideProfile.business_name ||
      guideProfile.businessName ||
      guideProfile.name ||
      booking.companyName ||
      booking.company_name ||
      booking.business_name ||
      "—";

    const rating =
      guideProfile.rating ??
      guideProfile.average_rating ??
      guideProfile.averageRating ??
      booking.companyRating ??
      booking.company_rating;

    const travelers =
      booking.travelers ??
      booking.number_of_travelers ??
      booking.numberOfTravelers ??
      booking.traveler_count ??
      booking.travelerCount ??
      booking.guests ??
      booking.number_of_guests ??
      booking.numberOfGuests ??
      travelRequest.travelers ??
      travelRequest.number_of_travelers ??
      travelRequest.numberOfTravelers ??
      travelRequest.traveler_count ??
      travelRequest.travelerCount ??
      travelRequest.guests ??
      travelRequest.number_of_guests ??
      travelRequest.numberOfGuests ??
      1;

    const tourDate =
      booking.travel_date ||
      booking.travelDate ||
      travelRequest.travel_date ||
      travelRequest.travelDate ||
      booking.requestedDate ||
      booking.requested_date ||
      booking.bookingDate ||
      booking.booking_date ||
      booking.date;

    const tourPrice =
      booking.budget ??
      booking.amount ??
      booking.tourPrice ??
      booking.tour_price ??
      booking.price ??
      experience.price ??
      experience.amount;

    const serviceFee =
      booking.serviceFee ??
      booking.service_fee ??
      0;

    const hasPrice =
      tourPrice !== undefined &&
      tourPrice !== null &&
      tourPrice !== "";

    const total = hasPrice
      ? Number(tourPrice) + Number(serviceFee || 0)
      : undefined;

    return {
      tourType,
      destination,
      companyName,
      rating,
      travelers,
      tourDate,
      tourPrice: hasPrice ? tourPrice : undefined,
      serviceFee,
      total,
      image:
        booking.image ||
        booking.image_url ||
        experience.image ||
        experience.image_url ||
        guideProfile.profile_image ||
        guideProfile.profile_image_url,
    };
  }, [booking]);

  return (
    <aside className="cp-summary">
      <h3>Booking Summary</h3>

      {summary ? (
        <>
          <div className="cp-summary-tour">
            {summary.image ? (
              <img
                src={summary.image}
                alt=""
                className="cp-summary-thumb"
              />
            ) : (
              <div
                className="cp-summary-thumb cp-summary-thumb--placeholder"
                style={{
                  background: logoColor(
                    summary.companyName || "?"
                  ),
                }}
              >
                {(summary.companyName || "?")
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

            <div>
              <p className="cp-summary-title">
                {summary.tourType}
              </p>

              <span className="cp-summary-company">
                {summary.companyName}
              </span>

              {summary.rating !== undefined &&
                summary.rating !== null && (
                  <span className="cp-summary-rating">
                    <FiStar aria-hidden="true" />{" "}
                    {summary.rating}
                  </span>
                )}
            </div>
          </div>

          <div className="cp-summary-rows">
            <div className="cp-summary-row">
              <span>
                <FiMapPin aria-hidden="true" />
                Destination
              </span>

              <span>{summary.destination}</span>
            </div>

            <div className="cp-summary-row">
              <span>Tour Type</span>

              <span>{summary.tourType}</span>
            </div>

            <div className="cp-summary-row">
              <span>Travelers</span>

              <span>
                {summary.travelers !== undefined &&
                summary.travelers !== null &&
                summary.travelers !== ""
                  ? `${summary.travelers} ${
                      Number(summary.travelers) === 1
                        ? "Person"
                        : "People"
                    }`
                  : "—"}
              </span>
            </div>

            <div className="cp-summary-row">
              <span>Tour Date</span>

              <span>
                {formatDisplayDate(summary.tourDate)}
              </span>
            </div>
          </div>

          <div className="cp-summary-price">
            <p className="cp-summary-price-title">
              Price Details
            </p>

            <div className="cp-summary-row">
              <span>Tour Price</span>

              <span>
                {formatMoney(summary.tourPrice)}
              </span>
            </div>

            <div className="cp-summary-row">
              <span>Service Fee</span>

              <span>
                {formatMoney(summary.serviceFee)}
              </span>
            </div>
          </div>

          <div className="cp-summary-total">
            <span>Total Amount</span>

            <span>
              {formatMoney(summary.total)}
            </span>
          </div>
        </>
      ) : (
        <p className="cp-summary-empty">
          No booking selected.
        </p>
      )}

      <div className="cp-secure">
        <FiShield aria-hidden="true" />

        <div>
          <p>Secure Payment</p>

          <span>
            Your payment information is 100% secure and encrypted.
          </span>
        </div>
      </div>
    </aside>
  );
}