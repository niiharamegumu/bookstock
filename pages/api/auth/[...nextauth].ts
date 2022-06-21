import { NextApiHandler } from 'next'
import nextAuth from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GitHubProvider from 'next-auth/providers/github'

import prisma from '../../../lib/prisma'

const options = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
  pages: {
    signIn: '/auth/login',
  },
}

const authHandler: NextApiHandler = (req, res) => nextAuth(req, res, options)
export default authHandler
