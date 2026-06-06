import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperclip,
  faCapsules,
  faCloudArrowUp,
  faCheckCircle,
  faTimes,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";
import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { RootState } from "../../store/store";
import api from "../../api/api";

const FileUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [medicineName, setMedicineName] = useState("");
  const [notes, setNotes] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Cleanup preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        toast.error("Please upload an image file only (jpg, png, etc.)");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setUploadSuccess(false);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Open file dialog
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering open file dialog
    setFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a prescription image first!");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please login to submit a prescription order.");
      navigate("/login");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      // 1. Upload file to server
      const uploadRes = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const imageUrl = uploadRes.data.image;

      // 2. Submit order with prescription image and delivery notes
      const orderRes = await api.post("/orders", {
        items: [],
        shippingAddress: {
          fullName: user?.name || "Prescription Order",
          address: notes || "Address details on review",
          city: "Cairo",
          phone: "01000000000", // Placeholder phone to satisfy validation
        },
        prescriptionImage: imageUrl,
        totalAmount: 0,
      });

      setOrderId(orderRes.data._id ? `MP-${orderRes.data._id.slice(-6).toUpperCase()}` : "MP-REC");
      setUploadSuccess(true);
      toast.success("Prescription submitted successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to upload prescription. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreviewUrl("");
    setMedicineName("");
    setNotes("");
    setUploadSuccess(false);
    setOrderId("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <section className="upload-section bg-light-blue py-5 position-relative overflow-hidden">
        <div className="container py-4">
          <div className="row align-items-center">
            
            {/* ─── LEFT PANEL: Dynamic Content (Details or Success State) ─── */}
            <div className="col-md-7 mb-4 mb-md-0 position-relative z-2 pr-md-5">
              {!uploadSuccess ? (
                <>
                  <h2 className="display-6 fw-bold text-dark-blue mb-3">
                    Order With Prescription
                  </h2>
                  <p className="text-secondary mb-4 fs-5">
                    Upload a photo of your prescription, add any details, and our pharmacists will review and deliver it!
                  </p>

                  {/* Form inputs for prescription details */}
                  <div className="mb-3 me-md-4">
                    <label className="form-label fw-bold text-dark-blue small">Medicine Name (Optional)</label>
                    <input
                      type="text"
                      className="form-control rounded-pill border-0 shadow-sm px-3 py-2.5"
                      placeholder="e.g. Panadol Extra or Augmentin 1g"
                      value={medicineName}
                      onChange={(e) => setMedicineName(e.target.value)}
                      disabled={isUploading}
                    />
                  </div>

                  <div className="mb-4 me-md-4">
                    <label className="form-label fw-bold text-dark-blue small">Address &amp; Special Delivery Notes</label>
                    <textarea
                      className="form-control rounded-4 border-0 shadow-sm px-3 py-3"
                      rows={3}
                      placeholder="Enter your delivery address and any instructions for the pharmacist..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      disabled={isUploading}
                    />
                  </div>

                  <button
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    className="btn btn-primary rounded-pill px-5 py-3 fw-bold shadow-sm d-flex align-items-center gap-2 text-white"
                  >
                    {isUploading ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                        PROCESSING UPLOAD...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faPaperclip} />
                        UPLOAD &amp; SUBMIT ORDER
                      </>
                    )}
                  </button>
                </>
              ) : (
                /* Upload success message template */
                <div className="card border-0 shadow-sm p-4 rounded-4 bg-white text-start me-md-4">
                  <div className="d-flex align-items-center gap-3 mb-3 text-success">
                    <FontAwesomeIcon icon={faCheckCircle} className="fa-3x" />
                    <div>
                      <h4 className="fw-bold mb-0">Prescription Submitted!</h4>
                      <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill">
                        Order ID: {orderId}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-secondary mb-3">
                    Thank you! Your prescription image and details have been sent to our closest partner pharmacy for review.
                  </p>

                  <div className="bg-light p-3 rounded-3 mb-4">
                    <div className="row g-2 small">
                      {medicineName && (
                        <div className="col-12">
                          <strong>Requested Medicine:</strong> {medicineName}
                        </div>
                      )}
                      <div className="col-12">
                        <strong>Prescription File:</strong> {file?.name}
                      </div>
                      {notes && (
                        <div className="col-12">
                          <strong>Delivery Notes:</strong> {notes}
                        </div>
                      )}
                      <div className="col-12">
                        <strong>Status:</strong> <span className="text-warning fw-bold">Pharmacist Review Pending</span>
                      </div>
                    </div>
                  </div>

                  <button onClick={resetForm} className="btn btn-outline-primary rounded-pill px-4 align-self-start">
                    Upload Another Prescription
                  </button>
                </div>
              )}
            </div>

            {/* ─── RIGHT PANEL: Live Image Preview & Drop Area ─── */}
            <div
              className="col-md-5 position-relative z-2"
              onClick={!uploadSuccess && !isUploading ? handleUploadClick : undefined}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="d-none"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading || uploadSuccess}
              />

              <div 
                className={`upload-card bg-white border-2 border-dashed rounded-4 p-4 text-center transition-hover position-relative ${
                  file ? "border-success shadow-sm" : "border-primary bg-opacity-50"
                }`}
                style={{ cursor: !uploadSuccess && !isUploading ? "pointer" : "default", minHeight: "260px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
              >
                {previewUrl ? (
                  /* Prescription Image Live Preview container */
                  <div className="w-100 position-relative">
                    <img 
                      src={previewUrl} 
                      alt="Prescription Preview" 
                      className="img-fluid rounded-3 border mb-2 shadow-2xs" 
                      style={{ maxHeight: "190px", objectFit: "contain" }}
                    />
                    
                    {!isUploading && !uploadSuccess && (
                      <button 
                        onClick={handleRemoveFile} 
                        className="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0 m-1 shadow-sm d-flex align-items-center justify-content-center"
                        style={{ width: "26px", height: "26px" }}
                        title="Remove Image"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    )}
                    
                    <p className="small text-success fw-bold mb-0 text-truncate px-3">
                      Selected: {file?.name}
                    </p>
                  </div>
                ) : (
                  /* Drag and Drop instructions container */
                  <>
                    <div className="mb-3">
                      <FontAwesomeIcon
                        icon={faCloudArrowUp}
                        className="fa-3x text-primary"
                      />
                    </div>
                    <h5 className="fw-bold text-dark-blue mb-1">
                      Drag &amp; Drop Prescription
                    </h5>
                    <p className="text-muted small mb-0">
                      or click to browse files
                    </p>
                  </>
                )}

                {/* Floating Decorative Icons */}
                <div className="position-absolute top-0 end-0 mt-n2 me-n2 d-none d-lg-block">
                  <FontAwesomeIcon
                    icon={faCapsules}
                    className="fa-2x text-danger opacity-75 rotate-45"
                  />
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </>
  );
};

export default FileUpload;
