const {
  handleSettingsValidation,
  getOrCreateSettings,
} = require("../models/siteSettings");

function settingsPath(filename) {
  return `/uploads/settings/${filename}`;
}

function parseKeywords(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return value.split(",").map((k) => k.trim()).filter(Boolean);
    }
  }
  return [];
}

exports.get = async (req, res) => {
  const settings = await getOrCreateSettings();
  res.send(settings);
};

exports.update = async (req, res) => {
  const { error } = handleSettingsValidation(req.body);
  if (error) {
    return res.status(400).send({ message: error.details.map((d) => d.message).join(", ") });
  }

  const settings = await getOrCreateSettings();
  const files = req.files || {};

  if (files.logo && files.logo[0]) {
    settings.logoUrl = settingsPath(files.logo[0].filename);
  }
  if (files.favicon && files.favicon[0]) {
    settings.faviconUrl = settingsPath(files.favicon[0].filename);
  }

  if (req.body.siteName !== undefined) settings.siteName = req.body.siteName;
  if (req.body.description !== undefined) settings.description = req.body.description;
  if (req.body.headerScripts !== undefined) settings.headerScripts = req.body.headerScripts;
  if (req.body.footerScripts !== undefined) settings.footerScripts = req.body.footerScripts;
  if (req.body.defaultLocale !== undefined) settings.defaultLocale = req.body.defaultLocale;
  if (req.body.keywords !== undefined) {
    settings.keywords = parseKeywords(req.body.keywords);
  }
  if (req.body.socialLinks !== undefined) {
    const links =
      typeof req.body.socialLinks === "string"
        ? JSON.parse(req.body.socialLinks)
        : req.body.socialLinks;
    settings.socialLinks = { ...settings.socialLinks?.toObject?.() || settings.socialLinks, ...links };
  }

  settings.updatedAt = new Date();
  await settings.save();
  res.send(settings);
};
