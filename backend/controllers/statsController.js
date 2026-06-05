const { customer } = require("../models/customers");
const { Product } = require("../models/product");
const { Order } = require("../models/orders");
const { Payment } = require("../models/payments");

/**
 * Generates structured boundaries for the last N calendar months.
 */
function lastMonths(count) {
  const months = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
    months.push({
      label: d.toLocaleString("en", { month: "short", year: "2-digit" }),
      start: d,
      end,
    });
  }
  return months;
}

/**
 * Counts array items matching specific chronological date boundaries.
 */
function countInRange(items, dateField, start, end) {
  return items.filter((item) => {
    const d = item[dateField];
    return d && d >= start && d <= end;
  }).length;
}

/**
 * Groups items dynamically based on property boundaries and configured mapping arrays.
 */
function groupByField(items, field, labels) {
  return labels.map((name) => ({
    name,
    value: items.filter((item) => item[field] === name).length,
  }));
}

/* -------------------------------------------------------------------------- */
/*  1. Admin Panel Global Store Analytics Overview                            */
/* -------------------------------------------------------------------------- */
exports.admin = async (req, res) => {
  const [customers, products, orders, payments] = await Promise.all([
    customer.find().select("role"),
    Product.find().select("category isPublished"),
    Order.find({ status: "completed" }).select("purchasedAt"),
    Payment.find().select("amount status paidAt"),
  ]);

  // Sum up completed e-commerce processing transactions
  const totalPayments = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const months = lastMonths(6);

  // Track orders trend over a 6-month scale
  const ordersByMonth = months.map((m) => ({
    name: m.label,
    value: countInRange(orders, "purchasedAt", m.start, m.end),
  }));

  // Track gross revenue performance trend over a 6-month scale
  const paymentsByMonth = months.map((m) => ({
    name: m.label,
    value: Math.round(
      payments
        .filter(
          (p) =>
            p.status === "completed" &&
            p.paidAt >= m.start &&
            p.paidAt <= m.end,
        )
        .reduce((sum, p) => sum + (p.amount || 0), 0) * 100,
    ) / 100,
  }));

  res.send({
    totals: {
      customers: customers.length,
      products: products.length,
      published: products.filter((p) => p.isPublished).length,
      orders: orders.length,
      totalPayments: Math.round(totalPayments * 100) / 100,
      paymentCount: payments.length,
    },
    paymentsByMonth,
    customersByRole: groupByField(customers, "role", ["admin", "seller", "customer"]),
    productsByCategory: groupByField(products, "category", ["personal care", "sports nutrition", "nutrition & supplements", "home healthcare"]),
    publishedStatus: [
      { name: "Published", value: products.filter((p) => p.isPublished).length },
      { name: "Draft", value: products.filter((p) => !p.isPublished).length },
    ],
    ordersByMonth,
  });
};

/* -------------------------------------------------------------------------- */
/*  2. Seller Dashboard Personal Store Metrics                                */
/* -------------------------------------------------------------------------- */
exports.seller = async (req, res) => {
  const products = await Product.find({ seller: req.customer._id }).select(
    "category isPublished name",
  );
  const productIds = products.map((p) => p._id);

  const orders = await Order.find({
    product: { $in: productIds },
    status: "completed",
  }).select("purchasedAt product");

  const months = lastMonths(6);
  const ordersByMonth = months.map((m) => ({
    name: m.label,
    value: countInRange(orders, "purchasedAt", m.start, m.end),
  }));

  // Aggregate processing pipeline to identify top 5 selling items for this vendor
  const topProducts = await Order.aggregate([
    { $match: { product: { $in: productIds }, status: "completed" } },
    { $group: { _id: "$product", value: { $sum: 1 } } },
    { $sort: { value: -1 } },
    { $limit: 5 },
  ]);

  const productMap = Object.fromEntries(products.map((p) => [p._id.toString(), p.name]));
  const ordersByProduct = topProducts.map((row) => ({
    name: productMap[row._id.toString()] || "Product",
    value: row.value,
  }));

  res.send({
    totals: {
      products: products.length,
      published: products.filter((p) => p.isPublished).length,
      orders: orders.length,
    },
    productsByCategory: groupByField(products, "category", ["personal care", "sports nutrition", "nutrition & supplements", "home healthcare"]),
    publishedStatus: [
      { name: "Published", value: products.filter((p) => p.isPublished).length },
      { name: "Draft", value: products.filter((p) => !p.isPublished).length },
    ],
    ordersByMonth,
    ordersByProduct,
  });
};

/* -------------------------------------------------------------------------- */
/*  3. Customer Profile Purchasing History Insights                           */
/* -------------------------------------------------------------------------- */
exports.customer = async (req, res) => {
  const orders = await Order.find({
    customer: req.customer._id,
    status: "completed",
  })
    .populate("product", "category name")
    .select("purchasedAt product");

  const months = lastMonths(6);
  const ordersByMonth = months.map((m) => ({
    name: m.label,
    value: countInRange(orders, "purchasedAt", m.start, m.end),
  }));

  const categories = ["personal care", "sports nutrition", "nutrition & supplements", "home healthcare"];
  const productsByCategory = categories.map((name) => ({
    name,
    value: orders.filter(
      (o) => o.product && o.product.category === name,
    ).length,
  }));

  res.send({
    totals: {
      purchasedItems: orders.length,
    },
    ordersByMonth,
    productsByCategory,
  });
};