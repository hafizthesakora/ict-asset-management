//app/libs/authOptions.js
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import db from './db';
import { compare } from 'bcrypt';
const authOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET || 'hgyweyhowhfe7gbhwbd',
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Check if credentials are present
          if (!credentials?.email || !credentials?.password) {
            console.log('Missing credentials');
            return null;
          }

          // Check if user exists
          const existingUser = await db.user.findUnique({
            where: { email: credentials.email },
          });

          if (!existingUser) {
            console.log('No user found for email:', credentials.email);
            return null;
          }

          // Ensure the user has a password stored
          if (!existingUser.hashedPassword) {
            console.log('User has no password stored in DB');
            return null;
          }

          // Compare passwords
          const passwordMatch = await compare(
            credentials.password,
            existingUser.hashedPassword
          );

          if (!passwordMatch) {
            console.log('Incorrect password');
            return null;
          }

          // Auth success
          return {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token;
    },
  },
};

export { authOptions };
