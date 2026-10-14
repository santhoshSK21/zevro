import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { User } from "./models/User"
import dbConnect from "./lib/mongodb"

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "zevro-super-secret-auth-key-change-in-prod",
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        await dbConnect()
        const user = await User.findOne({ email: credentials.email }).select("+password")
        
        if (!user) return null
        
        const storedPassword = user.password || user.passwordHash;
        if (!storedPassword) return null;

        const isPasswordMatch = await bcrypt.compare(credentials.password as string, storedPassword);
        if (!isPasswordMatch) return null;

        const displayName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;

        return {
          id: user._id.toString(),
          email: user.email,
          name: displayName,
          role: user.role || 'customer',
          sellerId: user.sellerId?.toString()
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
        token.sellerId = (user as any).sellerId
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as string
        session.user.id = token.id as string
        session.user.sellerId = token.sellerId as string | undefined
      }
      return session
    }
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: '/login',
  }
})
