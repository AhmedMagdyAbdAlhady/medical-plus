const { Order } = require("../models//orders");

/**
 * Checks if a customer  has access to premium product media/files.
 * Access is granted if the customer  is an admin, the seller of the product, 
 * or a customer with a completed order for this product.
 */
async function canAccessProductMedia(customer , product) {
  if (!customer ) return false;
  if (customer .role === "admin") return true;
  
  // Sellers can access their own product media
  if (
    customer .role === "seller" &&
    product.seller &&
    product.seller.toString() === customer ._id.toString()
  ) {
    return true;
  }
  
  // Customers must have a completed purchase history for this product
  if (customer .role === "customer") {
    const order = await Order.findOne({
      customer: customer ._id,
      product: product._id,
      status: "completed", // Only allow access if the order payment/delivery is completed
    });
    return !!order;
  }
  return false;
}

/**
 * Checks if a customer  has permission to modify or delete a product listing.
 * Permissions are restricted to administrators and the specific seller who owns the product.
 */
function canModifyProduct(customer , product) {
  if (!customer ) return false;
  if (customer .role === "admin") return true;
  
  // Only the assigned seller can modify the product
  if (
    customer .role === "seller" &&
    product.seller &&
    product.seller.toString() === customer ._id.toString()
  ) {
    return true;
  }
  return false;
}

module.exports = { canAccessProductMedia, canModifyProduct };
