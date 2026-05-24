const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Only store what's necessary: identity + auth
const userSchema = new mongoose.Schema({
  name:           { type: String, required: true, trim: true, maxlength: 100 },
  email:          { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash:   { type: String, required: true },
  profilePicture: { type: String, default: '' },
  favoriteGenres: [{ type: String }],
  savedMovies:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  role:           { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified:     { type: Boolean, default: true },
  lastLogin:      { type: Date, default: Date.now },
  createdAt:      { type: Date, default: Date.now },
  updatedAt:      { type: Date, default: Date.now },
});

// Hash password before save
userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return;
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
});

// Verify password
userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

// Never expose hash in responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
