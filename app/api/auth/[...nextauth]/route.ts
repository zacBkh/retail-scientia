import CredentialsProvider from 'next-auth/providers/credentials'
import NextAuth from 'next-auth'

import type { AuthOptions } from 'next-auth'

import { findAUser } from '@/services/prisma-queries'

import { compare } from 'bcrypt'

/*To add properties to session: 
 Add them to jwt (token) in the jwt callback
Retrieve them from the session callback
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
          randomKey: token.randomKey,
        },
      }
      console.log('enrichedSession', enrichedSession)
      return enrichedSession
    },

    jwt: ({ token, user }) => {
      console.log('token,user from api auth', token, user)
      if (user) {
        // if user JUST logged in, this will be available in jwt in session since we put the info below in the jwt
        const u = user as unknown as any
        return {
          ...token,
          id: u.id,
          randomKey: u.randomKey,
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
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied

        if (!credentials?.email || !credentials.password) {
          return null
        }

        const user = await findAUser(credentials.email)
        if (!user) {
          console.log('2')
          return null
        }

        const isPwdValid = await compare(credentials.password, user.password)
        if (!isPwdValid) {
          console.log('3')
          return null
        }

        console.log('user from API good auth !', user)
        // Any object returned will be saved in `user` property of the JWT
        // return user

        return {
          id: user.id + '',
          email: user.email,
          name: user.name,
          randomKey: 'kergjer',
        }
      },
    }),
  ],
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
