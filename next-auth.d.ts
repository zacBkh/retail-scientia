import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Brand {
    id: number
    name: string
    logo: string
  }

  interface Session {
    user: {
      /* Extending session by adding the id*/
      id: string
      brands: Brand[]
    } & DefaultSession['user']
  }
}
