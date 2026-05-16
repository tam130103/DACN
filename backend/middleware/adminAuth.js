const adminAuth = (req, res, next) => {
  const apiKey = req.headers["x-admin-api-key"] || req.headers.authorization?.replace("Bearer ", "");
  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  next();
};

export default adminAuth;
