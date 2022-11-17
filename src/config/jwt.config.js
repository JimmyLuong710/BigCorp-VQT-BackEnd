import dotenv from 'dotenv'
dotenv.config()

const jwtConfig = {
  accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
  refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY,
  algorithm: "RS256",
  accessTokenExpiration: '1d',
  refreshTokenExpiration: "7d",
};

export default jwtConfig;
