import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperclip,
  faCapsules,
  faCloudArrowUp,
} from "@fortawesome/free-solid-svg-icons";

// import style from"./FileUpload.module.css";
import { useRef, useState } from "react";

const FileUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  let [FileName, setFileName] = useState("");

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file only (jpg, png, etc.)");

        // مسح الـ input علشان ميفضلش فيه الملف الغلط
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setFileName(file.name);
    }
    // Capturing the first selected file
  };
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // This will open the file dialog
    }
  };
  const handleUpload = async () => {
    if (!fileInputRef.current?.files) {
      alert("Please select a file first");
      return;
    }
    console.log("Uploading fileInputRef:", fileInputRef.current?.files?.[0]);
    // const formData = new FormData();
    // formData.append("fileInputRef", fileInputRef); // 'fileInputRef' must match the key expected by your backend
    // try {
    //   const response = await axios.post('/api/upload', formData, {
    //     headers: { 'Content-Type': 'multipart/form-data' }
    //   });
    //   console.log('Upload successful:', response.data);
    // } catch (error) {
    //   console.error('Upload failed:', error);
    // }
  };
  return (
    <>
      {/* <!-- =======================================================
              START UPLOAD PRESCRIPTION SECTION
              Use 'bg-light-blue' for the background color
          ======================================================== --> */}
      <section className="upload-section bg-light-blue py-5 position-relative overflow-hidden">
        <div className="container py-4">
          <div className="row align-items-center">
            {/* <!-- Left Side: Text and Content --> */}
            <div className="col-md-7 mb-4 mb-md-0 position-relative z-2">
              <h2 className="display-6 fw-bold text-dark-blue mb-3">
                Order With Prescription
              </h2>
              <p className="text-secondary mb-4 fs-5">
                Upload A Photo Of Your Prescription, Add Your Complete
                <br className="d-none d-lg-block" />
                Address &
                <strong className="text-dark">
                  Just Wait For Us To Deliver!
                </strong>
              </p>

              <button
                onClick={() => handleUpload()}
                className="btn btn-primary rounded-pill px-5 py-3 fw-bold shadow-sm btn-upload"
              >
                <FontAwesomeIcon icon={faPaperclip} className="me-2" />
                UPLOAD NOW
              </button>
            </div>

            {/* <!-- Right Side: Drag & Drop UI Visualization --> */}
            <div
              className="col-md-5 position-relative z-2"
              onClick={handleUploadClick}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="d-none"
                accept="image/*"
                onChange={handleFileChange}
              />
              {/* <!-- This div simulates the "Drag & Drop" area requested --> */}
              <div className="upload-card bg-white bg-opacity-50 border-2 border-dashed border-primary rounded-4 p-5 text-center cursor-pointer transition-hover">
                <div className="mb-3">
                  <FontAwesomeIcon
                    icon={faCloudArrowUp}
                    className="fa-3x text-primary"
                  />
                </div>
                {FileName ? (
                  <p className="fw-bold text-dark-blue">
                    Selected File: <span className="fw-bold">{FileName}</span>
                  </p>
                ) : (
                  <>
                    <h5 className="fw-bold text-dark-blue">
                      Drag & Drop Prescription
                    </h5>
                    <p className="text-muted small mb-0">
                      or click to browse files
                    </p>
                  </>
                )}

                {/* <!-- Floating Decorative Icons (Purely CSS positioned inside relative container) --> */}
                <div className="position-absolute top-0 end-0 mt-n3 me-n3 d-none d-lg-block">
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
      {/* <!-- End Upload Prescription Section --> */}
    </>
  );
};
export default FileUpload;
