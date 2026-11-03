const jwt = require("jsonwebtoken");

function authCookieOptions() {
  const production = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: production,
    sameSite: production ? "none" : "lax",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000
  };
}

function issueAuthCookie(res, user) {
  const token = jwt.sign(
    { sub: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  res.cookie("tf_auth", token, authCookieOptions());
}

function clearAuthCookie(res) {
  const options = authCookieOptions();
  delete options.maxAge;
  res.clearCookie("tf_auth", options);
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}

module.exports = { issueAuthCookie, clearAuthCookie, publicUser };
