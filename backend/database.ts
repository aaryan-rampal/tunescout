import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

/** 
 * ✅ Upsert a user based on their email and store Spotify access/refresh tokens
 */
export const upsertUserWithSpotifyTokens = async (email: string, accessToken: string, refreshToken: string) => {
    return prisma.user.upsert({
      where: { email },
      update: { spotifyAccessToken: accessToken, spotifyRefreshToken: refreshToken },
      create: { email, password: "", spotifyAccessToken: accessToken, spotifyRefreshToken: refreshToken },
    });
  };
  
  /**
   * ✅ Retrieve a user's Spotify access and refresh tokens
   */
  export const getSpotifyTokensByEmail = async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
      select: { spotifyAccessToken: true, spotifyRefreshToken: true },
    });
  };
  
  /**
   * ✅ Update the Spotify access token for a user
   */
  export const updateSpotifyAccessToken = async (email: string, newAccessToken: string) => {
    return prisma.user.update({
      where: { email },
      data: { spotifyAccessToken: newAccessToken },
    });
  };
  
  export default prisma; // Export Prisma client instance