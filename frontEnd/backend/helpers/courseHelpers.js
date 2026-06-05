function uploadsPath(filename) {
  return `/uploads/${filename}`;
}

function sliderPathsFromFiles(files) {
  return (files || []).map((f) => uploadsPath(f.filename));
}

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

function parseSliderImages(body) {
  if (Array.isArray(body.courseSliderImages)) return body.courseSliderImages;
  if (typeof body.courseSliderImages === "string") {
    try {
      const parsed = JSON.parse(body.courseSliderImages);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return body.courseSliderImages || [];
}

function resolveCourseImages(req, existing) {
  const files = req.files || {};
  const coverFile = files.courseCover && files.courseCover[0];
  const sliderFiles = files.courseSliderImages || [];

  const courseCover = coverFile
    ? uploadsPath(coverFile.filename)
    : req.body.courseCover !== undefined
      ? req.body.courseCover
      : existing?.courseCover;

  let courseSliderImages;
  if (sliderFiles.length > 0) {
    courseSliderImages = sliderPathsFromFiles(sliderFiles);
  } else if (req.body.courseSliderImages !== undefined) {
    courseSliderImages = parseSliderImages(req.body);
  } else {
    courseSliderImages = existing?.courseSliderImages;
  }

  return { courseCover, courseSliderImages };
}

function buildCoursePayload(req, existing) {
  const { courseCover, courseSliderImages } = resolveCourseImages(req, existing);

  return {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    discount: req.body.discount,
    courseCover,
    courseSliderImages,
    author: req.body.author,
    category: req.body.category,
    tags: parseTags(req.body),
    isPublished: req.body.isPublished,
  };
}

module.exports = {
  uploadsPath,
  sliderPathsFromFiles,
  parseTags,
  parseSliderImages,
  resolveCourseImages,
  buildCoursePayload,
};
