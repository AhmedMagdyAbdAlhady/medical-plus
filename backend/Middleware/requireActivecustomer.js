const { customer  } = require("../models/customers");

async function requireActivecustomer (req, res, next) {
  try {
    const customer  = await customer .findById(req.customer ._id).select("role isActive");
    if (!customer ) {
      return res.status(401).send({ message: "customer  not found." });
    }

    if (
      (customer .role === "seller" || customer .role === "customer ") &&
      customer .isActive === false
    ) {
      return res.status(403).send({
        message: "Your account is deactivated. Contact an administrator.",
      });
    }

    req.currentcustomer  = customer ;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = requireActivecustomer ;
