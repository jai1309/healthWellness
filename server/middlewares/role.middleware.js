import { errorResponseBody } from "../utils/responsebody.js";

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({
        ...errorResponseBody,
        message: `Forbidden: Access restricted to roles - ${roles.join(", ")}`,
      });
    }
    next();
  };
};

export { authorizeRoles };
