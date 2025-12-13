import jwt from 'jsonwebtoken'

export const createJWT = async (payload: any) => {
   return await jwt.sign(
      { payload },
      process.env.JWT_SECRET_KEY as string
   )
}