function authorize(...roles) {
  return (req, res, next) => {
    if (!req.customer || !roles.includes(req.customer.role)) {
      return res.status(403).send({ message: "Access denied." });
    }
    next();
  };
}

module.exports = authorize;