import CredentialsProvider from 'next-auth/providers/credentials'
import NextAuth from 'next-auth'

import type { AuthOptions } from 'next-auth'

import { findAUser } from '@/services/prisma-queries'

import { compare } from 'bcrypt'

/*To add properties to session: 
- Add to the return of authorize function
- Add them to jwt (token) in the jwt callback
- Retrieve them from the session callback
*/

export const authOptions: AuthOptions = {
  session: { strategy: 'jwt' },
  callbacks: {
    session: ({ session, token }) => {
      const enrichedSession = {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          brands: token.brands,
          accountType: token.accountType,
        },
      }
      return enrichedSession
    },

    jwt: ({ token, user }) => {
      if (user) {
        console.log('user JWT', user)
        // if user JUST logged in, this will be available in jwt in session since we put the info below in the jwt
        const u = user as unknown as any
        return {
          ...token,
          id: u.id,
          accountType: u.accountType,
          brands: u.brands,
        }
      }
      return token
    },
  },

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'mohamad@gmail.fr',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: '*********',
        },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied

        // If email or pwd not supplied
        if (!credentials?.email || !credentials.password) {
          return null
        }

        // If user does not exist
        const user = await findAUser(credentials.email)
        if (!user) {
          return null
        }

        // If user exist but pwd does not match
        const isPwdValid = await compare(credentials.password, user.password)
        if (!isPwdValid) {
          return null
        }

        console.log('User authenticated ✅', user)
        // Any object returned will be saved in `user` property of the JWT
        // return user

        return {
          id: user.id + '',
          email: user.email,
          name: user.name,
          brands: user.brands,
          accountType: user.accountType,
        }
      },
    }),
  ],
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
