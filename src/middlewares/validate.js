export const validateRegister = (req, res, next) => {
  const { name, username, email, password, profilePic} = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }

  const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email"
    });
  }

  if (password.length < 4) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 4 characters"
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
}
    const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email"
    });
  }

  if (password.length < 4) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 4 characters"
    });
  }

  next();
};
export const validateUpdateUser = (req, res, next) => {
  const { name, username, email, password} = req.body ;

  if (!name && !username && !email && !password && !req.file) {
    return res.status(400).json({
      success: false,
      message: "Nothing to update",
    });
  }

  if (email) {
    const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }
  }

  if (password && password.length < 4) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 4 characters",
    });
  }

  next();
};