/**
 * Resolves the relative public path for an uploaded asset filename.
 */
function uploadsPath(filename) {
  return `/uploads/${filename}`;
}

/**
 * Maps a structural array of file objects to their respective absolute application paths.
 */
function sliderPathsFromFiles(files) {
  return (files || []).map((f) => uploadsPath(f.filename));
}

/**
 * Normalizes input tags into a clean array structure, handling both JSON parsing and comma-separated string boundaries.
 */
function parseTags(body) {
  if (Array.isArray(body.tags)) return body.tags;
  if (typeof body.tags === "string") {
    try {
      const parsed = JSON.parse(body.tags);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return body.tags.split(",").map((t) => t.trim()).filter(Boolean);
    }
  }
  return body.tags;
}

/**
 * Extracts and handles serialization fallback constraints for the product slider collection structure.
 */
function parseSliderImages(body) {
  if (Array.isArray(body.productSliderImages)) return body.productSliderImages;
  if (typeof body.productSliderImages === "string") {
    try {
      const parsed = JSON.parse(body.productSliderImages);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return body.productSliderImages || [];
}

/**
 * Determines whether to persist existing database string records or prioritize incoming multipart form file data buffers.
 */
function resolveProductImages(req, existing) {
  const files = req.files || {};
  const imageFile = files.productImage && files.productImage[0];
  const sliderFiles = files.productSliderImages || [];

  const image = imageFile
    ? uploadsPath(imageFile.filename)
    : req.body.image !== undefined
      ? req.body.image
      : existing?.image;

  let productSliderImages;
  if (sliderFiles.length > 0) {
    productSliderImages = sliderPathsFromFiles(sliderFiles);
  } else if (req.body.productSliderImages !== undefined) {
    productSliderImages = parseSliderImages(req.body);
  } else {
    productSliderImages = existing?.productSliderImages;
  }

  return { image, productSliderImages };
}

/**
 * Builds a structured, verified database payload reflecting medicine, healthcare, or sports product parameters.
 */
function buildProductPayload(req, existing) {
  const { image, productSliderImages } = resolveProductImages(req, existing);

  return {
    name: req.body.name,
    brand: req.body.brand,
    category: req.body.category,
    subCategory: req.body.subCategory,
    price: req.body.price,
    discount: req.body.discount,
    image,
    productSliderImages,
    productRelated: req.body.productRelated || [],
    generics: req.body.generics,
    usedFor: req.body.usedFor,
    howItWorks: req.body.howItWorks,
    precautions: req.body.precautions,
    sideEffects: req.body.sideEffects,
    description: req.body.description || req.body.discription,
    tags: parseTags(req.body),
    isPublished: req.body.isPublished,
  };
}

module.exports = {
  uploadsPath,
  sliderPathsFromFiles,
  parseTags,
  parseSliderImages,
  resolveProductImages,
  buildProductPayload,
};
