import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import api from "../../api/api";
import { toast } from "react-toastify";
import ImagePreview from "../../components/imagePreview/imagePreview";

interface Order {
  _id: string;
  id?: string;
  customerName?: string;
  date?: string;
  total?: number;
  user?: {
    name: string;
    email: string;
  };
  createdAt?: string;
  totalAmount: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  items: {
    product?: {
      name: string;
      price: number;
    };
    qty: number;
    price: number;
  }[];
  prescriptionImage?: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    phone: string;
  };
}

interface Medicine {
  _id?: string;
  id: number;
  image?: string;
  name: string;
  generic: string;
  category: string;
  price: number;
  quantity: number;
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "orders" | "inventory" | "analytics" | "settings"
  >("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<Medicine[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingInventory, setLoadingInventory] = useState(true);

  // Inventory editing states
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQty, setEditQty] = useState<number>(0);

  // Add new medicine form state
  const [newMed, setNewMed] = useState({
    name: "",
    generic: "",
    category: "Personal Care",
    price: 0,
    quantity: 0,
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // Settings states
  const [pharmacySettings, setPharmacySettings] = useState({
    name: "SereneMeds Central Pharmacy",
    address: "12 El-Gish Street, Assiut, Egypt",
    phone: "021 344 1122",
    deliveryFee: 20,
    isOpen: true,
  });
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Fetch all orders from backend
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await api.get("/orders/all");
      setOrders(res.data);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch all products/inventory from backend
  const fetchInventory = async () => {
    setLoadingInventory(true);
    try {
      const res = await api.get("/products");
      const mapped = res.data.map((p: any) => ({
        _id: p._id,
        id: p.id,
        name: p.name,
        image: p.image,
        generic: p.generics || "Generic",
        category: p.category,
        price: p.price,
        quantity: p.stock !== undefined ? p.stock : 50,
      }));
      setInventory(mapped);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch inventory");
    } finally {
      setLoadingInventory(false);
    }
  };

  // Fetch pharmacy settings from backend
  const fetchSettings = async () => {
    try {
      const res = await api.get("/settings");
      if (res.data) {
        setPharmacySettings({
          name: res.data.name || "SereneMeds Central Pharmacy",
          address: res.data.address || "12 El-Gish Street, Assiut, Egypt",
          phone: res.data.phone || "021 344 1122",
          deliveryFee:
            res.data.deliveryFee !== undefined ? res.data.deliveryFee : 25,
          isOpen: res.data.isOpen !== undefined ? res.data.isOpen : true,
        });
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to fetch settings from backend.");
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchInventory();
    fetchSettings();
  }, []);

  // Order Actions
  const handleOrderStatus = async (
    id: string,
    newStatus: Order["status"],
    currentOrder?: Order,
  ) => {
    try {
      let payload: any = { status: newStatus };

      // If accepting a pending prescription order (which has totalAmount 0 and a prescriptionImage)
      if (
        newStatus === "Processing" &&
        currentOrder &&
        currentOrder.totalAmount === 0 &&
        currentOrder.prescriptionImage
      ) {
        const inputPrice = window.prompt(
          "هذا الطلب تم رفعه بواسطة روشتة طبية. يرجى إدخال السعر الإجمالي للأدوية بالجنيه المصري (EGP):",
        );
        if (inputPrice === null) {
          // User clicked cancel
          return;
        }
        const numericPrice = parseFloat(inputPrice);
        if (isNaN(numericPrice) || numericPrice < 0) {
          toast.error("يرجى إدخال سعر صحيح أكبر من أو يساوي الصفر.");
          return;
        }
        payload.totalAmount = numericPrice;
      }

      await api.put(`/orders/${id}/status`, payload);

      let statusLabel = newStatus as string;
      if (newStatus === "Processing") statusLabel = "Preparing";
      if (newStatus === "Shipped") statusLabel = "Out for Delivery";

      toast.success(`Order status updated to "${statusLabel}"`);
      fetchOrders();
      // Fetch inventory to reflect any stock level changes
      fetchInventory();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to update order status",
      );
    }
  };

  // Delete Order Action
  const handleDeleteOrder = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this order record? This will update the analytics and cannot be undone.",
      )
    ) {
      try {
        await api.delete(`/orders/${id}`);
        toast.success("Order record deleted successfully");
        fetchOrders();
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to delete order");
      }
    }
  };

  // Inventory Actions
  const startEditQty = (med: Medicine) => {
    setEditingId(med.id);
    setEditQty(med.quantity);
  };

  const saveQty = async (id: number) => {
    const med = inventory.find((m) => m.id === id);
    if (!med) return;
    try {
      await api.put(`/products/${med._id || med.id}`, { stock: editQty });
      toast.success("Stock quantity updated successfully");
      setEditingId(null);
      fetchInventory();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update stock");
    }
  };

  const handleDeleteMedicine = async (id: number, name: string) => {
    const med = inventory.find((m) => m.id === id);
    if (!med) return;
    if (
      window.confirm(
        `Are you sure you want to remove "${name}" from inventory?`,
      )
    ) {
      try {
        await api.delete(`/products/${med._id || med.id}`);
        toast.success(`"${name}" removed from inventory`);
        if (editingId === id) setEditingId(null);
        fetchInventory();
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to delete medicine");
      }
    }
  };

  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.name || !newMed.generic) return;
    try {
      await api.post("/products", {
        name: newMed.name,
        brand: "Generic",
        category: newMed.category,
        subCategory: "General",
        price: Number(newMed.price),
        generics: newMed.generic,
        stock: Number(newMed.quantity),
        image: "/images/product1.webp",
        description: "Added via Admin Dashboard",
      });
      toast.success(`"${newMed.name}" added to inventory successfully`);
      setNewMed({
        name: "",
        generic: "",
        category: "Personal Care",
        price: 0,
        quantity: 0,
      });
      setShowAddForm(false);
      fetchInventory();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add medicine");
    }
  };

  // Settings Actions
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put("/settings", pharmacySettings);
      setSettingsSuccess(true);
      toast.success("Settings saved successfully to backend!");
      setTimeout(() => setSettingsSuccess(false), 3000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save settings");
    }
  };

  // Analytics Calculations
  const deliveredOrders = orders.filter((o) => o.status === "Delivered");
  const totalIncome = deliveredOrders.reduce(
    (sum, o) => sum + o.totalAmount,
    0,
  );
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === "Pending").length;
  const avgOrderValue =
    totalOrdersCount > 0
      ? orders.reduce((sum, o) => sum + o.totalAmount, 0) / totalOrdersCount
      : 0;
  const outOfStockItems = inventory.filter((m) => m.quantity === 0);
  const outOfStockCount = outOfStockItems.length;
  const outOfStockDisplay =
    outOfStockCount > 0 ? outOfStockItems[0].name : "None";

  return (
    <div className="container py-5">
      {/* Upper Title and Welcome banner */}
      <div
        className={`${styles.welcomeBanner} p-4 rounded-4 mb-4 text-white d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3`}
      >
        <div>
          <h2 className="fw-bold mb-1">Pharmacy Admin Dashboard</h2>
          <p className="mb-0 opacity-85">
            Manage your pharmacy orders, track inventory, and view analytics in
            real-time.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span
            className={`${styles.statusDot} ${pharmacySettings.isOpen ? styles.statusOnline : styles.statusOffline}`}
          ></span>
          <span className="fw-bold">
            {pharmacySettings.name} (
            {pharmacySettings.isOpen ? "Open" : "Closed"})
          </span>
        </div>
      </div>

      {/* Grid for Tabs and Content */}
      <div className="row g-4">
        {/* Left Side Navigation Sidebar */}
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <h5
              className="fw-bold text-muted px-2 mb-3 text-uppercase"
              style={{ fontSize: "0.8rem", letterSpacing: "1px" }}
            >
              Menu
            </h5>
            <div className="d-flex flex-column gap-2">
              <button
                onClick={() => setActiveTab("orders")}
                className={`btn text-start d-flex align-items-center gap-3 py-2.5 px-3 rounded-3 border-0 transition-all ${activeTab === "orders" ? styles.activeTabBtn : styles.tabBtn}`}
              >
                <i className="fas fa-shopping-cart"></i>
                <span className="fw-semibold">Orders</span>
                <span className="badge bg-primary rounded-pill ms-auto">
                  {totalOrdersCount} Total
                </span>
                {pendingOrdersCount > 0 && (
                  <span className="badge bg-danger rounded-pill">
                    {pendingOrdersCount} Pending
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("inventory")}
                className={`btn text-start d-flex align-items-center gap-3 py-2.5 px-3 rounded-3 border-0 transition-all ${activeTab === "inventory" ? styles.activeTabBtn : styles.tabBtn}`}
              >
                <i className="fas fa-boxes"></i>
                <span className="fw-semibold">Inventory</span>
                <span className="badge bg-warning text-dark rounded-pill ms-auto">
                  {inventory.filter((m) => m.quantity === 0).length} Out
                </span>
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`btn text-start d-flex align-items-center gap-3 py-2.5 px-3 rounded-3 border-0 transition-all ${activeTab === "analytics" ? styles.activeTabBtn : styles.tabBtn}`}
              >
                <i className="fas fa-chart-line"></i>
                <span className="fw-semibold">Analytics</span>
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`btn text-start d-flex align-items-center gap-3 py-2.5 px-3 rounded-3 border-0 transition-all ${activeTab === "settings" ? styles.activeTabBtn : styles.tabBtn}`}
              >
                <i className="fas fa-cog"></i>
                <span className="fw-semibold">Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Content Panel */}
        <div className="col-lg-9">
          <div
            className="card border-0 shadow-sm rounded-4 p-4 bg-white"
            style={{ minHeight: "450px" }}
          >
            {/* ─── ORDERS TAB ──────────────────────────────────────────────── */}
            {activeTab === "orders" && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold mb-0 text-dark-blue">
                    Incoming Orders
                  </h4>
                  <div className="text-muted small">
                    Showing {orders.length} orders total
                  </div>
                </div>

                {loadingOrders ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading orders...</span>
                    </div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <i className="fas fa-inbox fa-3x mb-3 text-secondary"></i>
                    <p className="mb-0">No orders placed yet.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light text-muted">
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Date</th>
                          <th>Items Summary</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order._id}>
                            <td className="fw-bold text-dark">
                              {order._id
                                ? `MP-${order._id.slice(-6).toUpperCase()}`
                                : "MP-REC"}
                            </td>
                            <td>
                              {order.shippingAddress?.fullName ||
                                order.customerName ||
                                "Customer"}
                            </td>
                            <td>
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString()
                                : order.date || "N/A"}
                            </td>
                            <td style={{ maxWidth: "220px" }}>
                              {order.items && order.items.length > 0 ? (
                                <div
                                  className="text-truncate"
                                  title={order.items
                                    .map(
                                      (i) =>
                                        `${i.product?.name || "Medicine"} x${i.qty}`,
                                    )
                                    .join(", ")}
                                >
                                  {order.items
                                    .map(
                                      (i) =>
                                        `${i.product?.name || "Medicine"} x${i.qty}`,
                                    )
                                    .join(", ")}
                                </div>
                              ) : order.prescriptionImage ? (
                                <span className="text-info d-flex align-items-center gap-1.5">
                                  <i className="fas fa-file-prescription"></i>
                                  <span>Prescription Review Required</span>
                                  <a
                                    href={
                                      order.prescriptionImage.startsWith("http")
                                        ? order.prescriptionImage
                                        : `http://localhost:5000${order.prescriptionImage}`
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="badge bg-primary text-white text-decoration-none ms-1 px-2 py-1"
                                  >
                                    View
                                  </a>
                                </span>
                              ) : (
                                <span className="text-muted">No items</span>
                              )}
                            </td>
                            <td className="fw-bold text-dark-blue">
                              {order.totalAmount.toFixed(2)} EGP
                            </td>
                            <td>
                              <span
                                className={`badge px-2.5 py-1.5 rounded-pill ${
                                  order.status === "Pending"
                                    ? "bg-info text-white"
                                    : order.status === "Processing"
                                      ? "bg-warning text-dark"
                                      : order.status === "Shipped"
                                        ? "bg-primary text-white"
                                        : order.status === "Delivered"
                                          ? "bg-success text-white"
                                          : "bg-secondary text-white"
                                }`}
                              >
                                {order.status === "Processing"
                                  ? "Preparing"
                                  : order.status === "Shipped"
                                    ? "Out for Delivery"
                                    : order.status}
                              </span>
                            </td>
                            <td className="text-end">
                              <div className="d-flex justify-content-end gap-1.5">
                                {order.status === "Pending" && (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleOrderStatus(
                                          order._id,
                                          "Processing",
                                          order,
                                        )
                                      }
                                      className="btn btn-sm btn-success text-white px-2.5"
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleOrderStatus(
                                          order._id,
                                          "Cancelled",
                                        )
                                      }
                                      className="btn btn-sm btn-outline-danger px-2.5"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                                {order.status === "Processing" && (
                                  <button
                                    onClick={() =>
                                      handleOrderStatus(order._id, "Shipped")
                                    }
                                    className="btn btn-sm btn-primary text-white px-2.5"
                                  >
                                    Ship
                                  </button>
                                )}
                                {order.status === "Shipped" && (
                                  <button
                                    onClick={() =>
                                      handleOrderStatus(order._id, "Delivered")
                                    }
                                    className="btn btn-sm btn-success text-white px-2.5"
                                  >
                                    Deliver
                                  </button>
                                )}
                                {(order.status === "Delivered" ||
                                  order.status === "Cancelled") && (
                                  <div className="d-flex align-items-center justify-content-end gap-2">
                                    <span className="text-muted small italic">
                                      Completed
                                    </span>
                                    <button
                                      onClick={() =>
                                        handleDeleteOrder(order._id)
                                      }
                                      className="btn btn-sm btn-outline-danger p-1"
                                      title="Delete Order Record"
                                      style={{ minWidth: "30px" }}
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ─── INVENTORY TAB ───────────────────────────────────────────── */}
            {activeTab === "inventory" && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold mb-0 text-dark-blue">
                    Medicine Stock
                  </h4>
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="btn btn-primary text-white btn-sm rounded-pill px-3"
                  >
                    <i className="fas fa-plus me-1"></i> Add Medicine
                  </button>
                </div>

                {showAddForm && (
                  <form
                    onSubmit={handleAddMedicine}
                    className="card p-3 border rounded-3 mb-4 bg-light shadow-2xs"
                  >
                    <h6 className="fw-bold text-dark-blue mb-3">
                      Add New Medicine to Stock
                    </h6>
                    <div className="row g-3">
                      <div className="col-md-3">
                        <input
                          type="text"
                          placeholder="Medicine Name"
                          required
                          className="form-control form-control-sm"
                          value={newMed.name}
                          onChange={(e) =>
                            setNewMed({ ...newMed, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-md-2">
                        <input
                          type="text"
                          placeholder="Generic Name"
                          required
                          className="form-control form-control-sm"
                          value={newMed.generic}
                          onChange={(e) =>
                            setNewMed({ ...newMed, generic: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-md-2">
                        <select
                          className="form-select form-select-sm"
                          value={newMed.category}
                          onChange={(e) =>
                            setNewMed({ ...newMed, category: e.target.value })
                          }
                        >
                          <option value="Personal Care">Personal Care</option>
                          <option value="Beauty Care">Beauty Care</option>
                          <option value="Sports Nutrition">
                            Sports Nutrition
                          </option>
                          <option value="Nutrition Supplements">
                            Nutrition Supplements
                          </option>
                          <option value="Home Healthcare">
                            Home Healthcare
                          </option>
                          <option value="Mother & Baby Care">
                            Mother & Baby Care
                          </option>
                          <option value="Medicines">Medicines</option>
                        </select>
                      </div>
                      <div className="col-md-2">
                        <input
                          type="number"
                          placeholder="Price"
                          required
                          className="form-control form-control-sm"
                          value={newMed.price || ""}
                          onChange={(e) =>
                            setNewMed({
                              ...newMed,
                              price: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="col-md-2">
                        <input
                          type="number"
                          placeholder="Qty"
                          required
                          className="form-control form-control-sm"
                          value={newMed.quantity || ""}
                          onChange={(e) =>
                            setNewMed({
                              ...newMed,
                              quantity: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="col-md-1 d-flex gap-2">
                        <button
                          type="submit"
                          className="btn btn-sm btn-primary text-white w-100"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {loadingInventory ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading stock...</span>
                    </div>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light text-muted">
                        <tr>
                          <th>Med ID</th>
                          <th>Name</th>
                          <th>Generic Name</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th >Qty in Stock</th>
                          <th>Status</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventory.map((med, index) => {
                          console.log("Rendering medicine:", med);
                          return (
                            <tr key={med.id}>
                              <td className="text-muted">#{index + 1}</td>
                              <td className="fw-semibold text-dark" title={`show image of ${med.name}`}>
                                <ImagePreview
                                  name={med.name}
                                  imgUrl={med.image || "/images/product1.webp"}
                                  placement="right"
                                  width="200px"
                                  height="200px"
                                >
                                  {med.name}
                                </ImagePreview>
                              </td>

                              <td className="small text-muted">
                                {med.generic}
                              </td>
                              <td>{med.category}</td>
                              <td className="small fw-bold text-dark mt-1 text-truncate">
                                {med.price.toFixed(2)} EGP
                              </td>
                              <td>
                                {editingId === med.id ? (
                                  <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    style={{ width: "80px" }}
                                    value={editQty}
                                    onChange={(e) =>
                                      setEditQty(Number(e.target.value))
                                    }
                                  />
                                ) : (
                                  <span className="fw-bold">
                                    {med.quantity}
                                  </span>
                                )}
                              </td>
                              <td>
                                {med.quantity === 0 ? (
                                  <span className="badge bg-danger rounded-pill px-2">
                                    Out of Stock
                                  </span>
                                ) : med.quantity <= 5 ? (
                                  <span className="badge bg-warning text-dark rounded-pill px-2">
                                    Low Stock
                                  </span>
                                ) : (
                                  <span className="badge bg-success rounded-pill px-2">
                                    In Stock
                                  </span>
                                )}
                              </td>
                              <td className="text-end">
                                {editingId === med.id ? (
                                  <div className="d-flex justify-content-end gap-1">
                                    <button
                                      onClick={() => saveQty(med.id)}
                                      className="btn btn-sm btn-success text-white px-2"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingId(null)}
                                      className="btn btn-sm btn-outline-secondary px-2"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <div className="d-flex justify-content-end gap-1">
                                    <button
                                      onClick={() => startEditQty(med)}
                                      className="btn btn-sm btn-outline-primary px-2"
                                    >
                                      <i
                                        title="Edit Qty"
                                        className="fas fa-edit me-1"
                                      ></i>
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteMedicine(med.id, med.name)
                                      }
                                      className="btn btn-sm btn-outline-danger px-2"
                                      title="Delete medicine"
                                    >
                                      <i
                                        title="Delete Medicine"
                                        className="fas fa-trash"
                                      ></i>
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ─── ANALYTICS TAB ───────────────────────────────────────────── */}
            {activeTab === "analytics" && (
              <div>
                <h4 className="fw-bold mb-4 text-dark-blue">
                  Pharmacy Performance
                </h4>

                {/* Stats cards grid */}
                <div className="row g-3 mb-4">
                  <div className="col-md-3">
                    <div className="card p-3 border-0 bg-light-blue rounded-3 text-center">
                      <h6 className="text-muted small text-uppercase">
                        Total Income
                      </h6>
                      <h3 className="fw-bold text-dark-blue mb-0">
                        {totalIncome.toFixed(2)} EGP
                      </h3>
                      <div className="text-success small mt-1">
                        <i className="fas fa-arrow-up"></i> +12% this month
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card p-3 border-0 bg-light-blue rounded-3 text-center">
                      <h6 className="text-muted small text-uppercase">
                        Total Orders
                      </h6>
                      <h3 className="fw-bold text-dark-blue mb-0">
                        {totalOrdersCount}
                      </h3>
                      <div className="text-success small mt-1">
                        <i className="fas fa-arrow-up"></i> +8% this month
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card p-3 border-0 bg-light-blue rounded-3 text-center">
                      <h6 className="text-muted small text-uppercase">
                        Avg Order value
                      </h6>
                      <h3 className="fw-bold text-dark-blue mb-0">
                        {avgOrderValue.toFixed(2)} EGP
                      </h3>
                      <div className="text-danger small mt-1">
                        <i className="fas fa-arrow-down"></i> -1.2% this month
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card p-3 border-0 bg-light-blue rounded-3 text-center">
                      <h6 className="text-muted small text-uppercase">
                        Out of Stock Alert
                      </h6>
                      <h3 className="fw-bold text-danger mb-0">
                        {outOfStockCount} item{outOfStockCount !== 1 ? "s" : ""}
                      </h3>
                      <div
                        className="text-muted small mt-1 text-truncate"
                        title={outOfStockDisplay}
                      >
                        {outOfStockDisplay}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CSS Based Interactive Graph */}
                <div className="card p-4 border rounded-3 bg-white">
                  <h6 className="fw-bold text-dark-blue mb-4">
                    Monthly Order Load
                  </h6>
                  <div
                    className="d-flex justify-content-between align-items-end h-100 mt-2 px-3"
                    style={{ height: "200px" }}
                  >
                    {[
                      { month: "Jan", orders: 120, pct: "40%" },
                      { month: "Feb", orders: 180, pct: "60%" },
                      { month: "Mar", orders: 150, pct: "50%" },
                      { month: "Apr", orders: 240, pct: "80%" },
                      { month: "May", orders: 290, pct: "95%" },
                      {
                        month: "June",
                        orders: totalOrdersCount || 5,
                        pct: "100%",
                      },
                    ].map((item) => (
                      <div
                        key={item.month}
                        className="d-flex flex-column align-items-center gap-2"
                        style={{ flex: 1 }}
                      >
                        <div className="small text-muted">{item.orders}</div>
                        <div
                          className="bg-primary-blue rounded-top-2 w-50 transition-all hover-opacity-80"
                          style={{
                            height: `calc(${item.pct} * 1.5)`,
                            minHeight: "10px",
                          }}
                        ></div>
                        <div className="fw-bold small">{item.month}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── SETTINGS TAB ────────────────────────────────────────────── */}
            {activeTab === "settings" && (
              <div>
                <h4 className="fw-bold mb-4 text-dark-blue">
                  Pharmacy Settings
                </h4>

                {settingsSuccess && (
                  <div
                    className="alert alert-success alert-dismissible fade show rounded-3"
                    role="alert"
                  >
                    <i className="fas fa-check-circle me-1"></i> Settings saved
                    successfully!
                  </div>
                )}

                <form onSubmit={handleSaveSettings}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold text-uppercase">
                        Pharmacy Display Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={pharmacySettings.name}
                        onChange={(e) =>
                          setPharmacySettings({
                            ...pharmacySettings,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold text-uppercase">
                        Pharmacy Hotline Phone
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={pharmacySettings.phone}
                        onChange={(e) =>
                          setPharmacySettings({
                            ...pharmacySettings,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label text-muted small fw-bold text-uppercase">
                        Address
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={pharmacySettings.address}
                        onChange={(e) =>
                          setPharmacySettings({
                            ...pharmacySettings,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold text-uppercase">
                        Delivery Fee (EGP)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        value={pharmacySettings.deliveryFee}
                        onChange={(e) =>
                          setPharmacySettings({
                            ...pharmacySettings,
                            deliveryFee: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6 d-flex align-items-center mt-5">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="pharmacyOpenSwitch"
                          checked={pharmacySettings.isOpen}
                          onChange={(e) =>
                            setPharmacySettings({
                              ...pharmacySettings,
                              isOpen: e.target.checked,
                            })
                          }
                        />
                        <label
                          className="form-check-label fw-semibold"
                          htmlFor="pharmacyOpenSwitch"
                        >
                          Accepting Orders (Online)
                        </label>
                      </div>
                    </div>
                    <div className="col-12 mt-4">
                      <button
                        type="submit"
                        className="btn btn-primary text-white px-4 rounded-pill"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
