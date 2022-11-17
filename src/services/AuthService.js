import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwt.config";
import bcrypt from "bcryptjs";

class AuthService {
  static async verifyToken(token, type = "accessToken") {
    let privateKey =
      type == "accessToken"
        ? jwtConfig.accessTokenPrivateKey
        : jwtConfig.refreshTokenPrivateKey;
    let decoded = jwt.verify(token, privateKey);

    return decoded;
  }

  static async createToken(payload, type = "accessToken") {
    let privateKey =
      type == "accessToken"
        ? jwtConfig.accessTokenPrivateKey
        : jwtConfig.refreshTokenPrivateKey;
    let expiresIn =
      type == "accessToken"
        ? jwtConfig.accessTokenExpiration
        : jwtConfig.refreshTokenExpiration;

    let token = jwt.sign(payload, privateKey, {
      expiresIn: expiresIn,
    });

    return token;
  }

  static async hashPassword(password) {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);

    return hash;
  }

  static async comparePassword(password, hash) {
    let result = await bcrypt.compare(password, hash);

    return result;
  }
}

module.exports = AuthService;
