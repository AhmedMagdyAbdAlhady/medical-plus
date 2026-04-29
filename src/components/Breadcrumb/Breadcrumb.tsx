import { Link } from "react-router-dom";
import type { BreadcrumbsProps } from "../../types/Breadcrumbtypes";
import styles from "./Breadcrumb.module.css";

/**
 * Breadcrumb Component
 * This component renders a dynamic navigation path based on the 'items' prop.
 * 
 * @param {BreadcrumbsProps} items - An array of objects containing 'label' and optional 'href'.
 */
const Breadcrumb = ({ items }: BreadcrumbsProps) => {
  return (
    <>
      {/* Main navigation container for accessibility */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb mb-0">
          
          {/* Static Home link - Always visible as the first entry */}
          <li className="breadcrumb-item">
            <Link to="/" className="text-muted text-decoration-none">
              Home
            </Link>
          </li>

          {/* Map through the items array to build dynamic links */}
          {items.map((item, index) => {
            // Check if the current item is the last one in the list
            const isLast = index === items.length - 1;
            
            // Dynamic CSS classes:
            // If it's the last item, we highlight it as 'active' (blue/bold).
            // Otherwise, it remains 'muted' (grey).
            const dynamicClass = isLast 
              ? "breadcrumb-item active text-primary fw-bold" 
              : "text-muted text-decoration-none";

            return item.href ? (
              /* Case 1: Item has a link (href) */
              <li key={index} className="breadcrumb-item">
                <Link to={item.href} className={dynamicClass}>
                  {item.label}
                </Link>
              </li>
            ) : (
              /* Case 2: Item is plain text (no href), usually the current page */
              <li
                key={index}
                className={dynamicClass}
                aria-current="page"
              >
                {item.label}
              </li>
            );
          })}
        </ol>
        {/* Visual separator line below the breadcrumbs */}
        <hr className="mt-2 text-muted-light" />
      </nav>
    </>
  );
};

export default Breadcrumb;