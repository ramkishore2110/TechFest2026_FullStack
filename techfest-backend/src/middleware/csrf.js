const crypto = require("crypto");

function cookieOptions() {
  const production = process.env.NODE_ENV === "production";
  return {
    httpOnly: false,
    secure: production,
    sameSite: production ? "none" : "lax",
    path: "/",
    maxAge: 2 * 60 * 60 * 1000
  };
}

function issueCsrfToken(req, res) {
  const token = crypto.randomBytes(32).toString("hex");
  res.cookie("tf_csrf", token, cookieOptions());
  res.json({ csrfToken: token });
}

function csrfProtection(req, res, next) {
  const safeMethods = ["GET", "HEAD", "OPTIONS"];
  if (safeMethods.includes(req.method)) return next();

  const cookieToken = req.cookies?.tf_csrf;
  const headerToken = req.get("x-csrf-token");

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({ message: "CSRF check failed. Refresh the page and try again." });
  }

  next();
}

module.exports = { issueCsrfToken, csrfProtection };
