import { useMemo } from "react";
import { FiMapPin, FiStar, FiShield } from "react-icons/fi";
import { logoColor } from "../mockRequestsBookings";

function formatMoney(value) {
  if (value === undefined || value === null || value === "") return "—";
  return `৳${Number(value).toLocaleString()}`;
}

/**
 * Right-hand "Booking Summary" card on the payment page. Every value comes
 * straight from the `booking` object passed in (the request/payment the
 * tourist is paying for) — there is no mock/placeholder data here. Missing
 * fields fall back to "—" until the backend actually supplies them.
 */
export default function PaymentBookingSummary({ booking }) {
  const summary = useMemo(() => {
    if (!booking) return null;

    const tourName = booking.tourTitle || booking.tourName || booking.destination || "—";
    const companyName = booking.companyName || "—";
    const rating = booking.companyRating;
    const destination = booking.destination || "—";
    const tourType = booking.tourType || "—";
    const travelers = booking.travelers;
    const tourDate = booking.requestedDate || booking.bookingDate || booking.date;
    const tourPrice = booking.budget ?? booking.amount ?? booking.tourPrice;
    const serviceFee = booking.serviceFee;
    const hasPrice = tourPrice !== undefined && tourPrice !== null;
    const hasFee = serviceFee !== undefined && serviceFee !== null;
    const total = hasPrice ? Number(tourPrice) + (hasFee ? Number(serviceFee) : 0) : undefined;

    return {
      tourName,
      companyName,
      rating,
      destination,
      tourType,
      travelers,
      tourDate,
      tourPrice: hasPrice ? tourPrice : undefined,
      serviceFee: hasFee ? serviceFee : 0,
      total,
      image: booking.image,
    };
  }, [booking]);

  return (
    <aside className="cp-summary">
      <h3>Booking Summary</h3>

      {summary ? (
        <>
          <div className="cp-summary-tour">
            {summary.image ? (
              <img src={summary.image} alt="" className="cp-summary-thumb" />
            ) : (
              <div
                className="cp-summary-thumb cp-summary-thumb--placeholder"
                style={{ background: logoColor(summary.companyName || "?") }}
              >
                {(summary.companyName || "?").charAt(0)}
              </div>
            )}
            <div>
              <p className="cp-summary-title">{summary.tourName}</p>
              <span className="cp-summary-company">{summary.companyName}</span>
              {summary.rating !== undefined && (
                <span className="cp-summary-rating">
                  <FiStar aria-hidden="true" /> {summary.rating}
                </span>
              )}
            </div>
          </div>

          <div className="cp-summary-rows">
            <div className="cp-summary-row">
              <span>
                <FiMapPin aria-hidden="true" /> Destination
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
                {summary.travelers !== undefined
                  ? `${summary.travelers} ${summary.travelers === 1 ? "Person" : "People"}`
                  : "—"}
              </span>
            </div>
            <div className="cp-summary-row">
              <span>Tour Date</span>
              <span>{summary.tourDate || "—"}</span>
            </div>
          </div>

          <div className="cp-summary-price">
            <p className="cp-summary-price-title">Price Details</p>
            <div className="cp-summary-row">
              <span>Tour Price</span>
              <span>{formatMoney(summary.tourPrice)}</span>
            </div>
            <div className="cp-summary-row">
              <span>Service Fee</span>
              <span>{formatMoney(summary.serviceFee)}</span>
            </div>
          </div>

          <div className="cp-summary-total">
            <span>Total Amount</span>
            <span>{formatMoney(summary.total)}</span>
          </div>
        </>
      ) : (
        <p className="cp-summary-empty">No booking selected.</p>
      )}

      <div className="cp-secure">
        <FiShield aria-hidden="true" />
        <div>
          <p>Secure Payment</p>
          <span>Your payment information is 100% secure and encrypted.</span>
        </div>
      </div>
    </aside>
  );
}
