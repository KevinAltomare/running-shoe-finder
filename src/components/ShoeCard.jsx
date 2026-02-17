// ShoeCard.jsx
import { useState } from "react";
import { formatAttributes } from "../logic/attributeHelpers";
import AffiliateButton from "../components/AffiliateButton";

export default function ShoeCard({ shoe, explanation, tagline }) {
  const [open, setOpen] = useState(false);
  const attributes = formatAttributes(shoe);

  return (
    <div className="shoe-card">
      <img 
        src={shoe.image_url} 
        alt={`${shoe.brand} ${shoe.model}`} 
        className="shoe-image"
      />

      <div className="shoe-info">
        <h2 className="shoe-title">
          {shoe.brand} {shoe.model} {shoe.version}
        </h2>
        

        <p className="shoe-tagline">{tagline}</p>

        {/* At a glance */}
        <div className="shoe-attributes">
          {attributes.map((attr, i) => (
            <span key={i} className="shoe-attribute">
              {attr}
            </span>
          ))}
        </div>

        {/* Why we picked this */}
        <div className="why-container">
          <button 
            className="why-toggle"
            onClick={() => setOpen(!open)}
          >
            Why we picked this
          </button>

          {open && (
            <ul className="why-list">
              {explanation.map((reason, i) => (
                <li key={i} className="why-item">
                  {reason}
                </li>
              ))}
            </ul>
          )}
        </div>
        <AffiliateButton href={shoe.affiliate_link} />

      </div>
    </div>
  );
}