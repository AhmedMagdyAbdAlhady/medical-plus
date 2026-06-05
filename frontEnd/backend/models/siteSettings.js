const mongoose = require("mongoose");
const Joi = require("joi");

const siteSettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: "CourseHub" },
  keywords: { type: [String], default: [] },
  description: { type: String, default: "" },
  logoUrl: { type: String, default: "" },
  faviconUrl: { type: String, default: "" },
  headerScripts: { type: String, default: "" },
  footerScripts: { type: String, default: "" },
  defaultLocale: { type: String, enum: ["en", "ar"], default: "en" },
  socialLinks: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
  },
  updatedAt: { type: Date, default: Date.now },
});

function handleSettingsValidation(data) {
  const schema = Joi.object({
    siteName: Joi.string().max(100),
    keywords: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string(),
    ),
    description: Joi.string().max(500),
    logoUrl: Joi.string().allow(""),
    faviconUrl: Joi.string().allow(""),
    headerScripts: Joi.string().allow(""),
    footerScripts: Joi.string().allow(""),
    defaultLocale: Joi.string().valid("en", "ar"),
    socialLinks: Joi.object({
      facebook: Joi.string().allow(""),
      twitter: Joi.string().allow(""),
      instagram: Joi.string().allow(""),
      linkedin: Joi.string().allow(""),
    }),
  });
  return schema.validate(data);
}

const SiteSettings = mongoose.model("SiteSettings", siteSettingsSchema);

async function getOrCreateSettings() {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  return settings;
}

exports.SiteSettings = SiteSettings;
exports.handleSettingsValidation = handleSettingsValidation;
exports.getOrCreateSettings = getOrCreateSettings;
