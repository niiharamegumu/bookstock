import { Article as ArticleType, User } from '@prisma/client'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { FC } from 'react'

import prisma from '../../lib/prisma'
import { changeBookmark } from '../../utils/functions'

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
  res,
}) => {
  const session = await getSession({ req })
  if (!session) {
    res.statusCode = 403
    return { props: { article: null } }
  }
  const data = await prisma.article.findUnique({
    where: {
      id: Number(params?.id),
    },
    include: {
      users: true,
    },
  })
  if (!data) {
    res.statusCode = 404
    return { props: { article: null } }
  }
  const article: ArticleType & { users: User[] } = JSON.parse(
    JSON.stringify(data)
  )
  const isBookmarked = article.users.some(
    (user: User) => user.email === session.user?.email
  )

  return {
    props: { article, isBookmarked },
  }
}

type Props = {
  article: ArticleType & { users: User[] }
  isBookmarked: Boolean
}

const Article: FC<Props> = (props) => {
  const { article, isBookmarked } = props

  if (!article) {
    return (
      <div className="text-center mt-20">
        <p>Not Found...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <div className="my-12 flex justify-center p-12">
        <div className="ml-auto mr-auto w-full lg:w-8/12">
          <div className="text-lightBlue-500 bg-lightBlue-200 mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-3 text-center shadow-sm"></div>
          <h3 className="text-3xl font-semibold">{article.title}</h3>
          <p className="text-blueGray-500 mt-4 text-lg leading-relaxed">
            {article.content}
          </p>
          {isBookmarked ? (
            <button
              onClick={() => changeBookmark(props.article.id, 'remove')}
              type="button"
              className="mt-5 inline-flex items-center rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            >
              Remove Bookmark
              <span className="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-200 text-xs font-semibold text-red-800">
                {article.users.length}
              </span>
            </button>
          ) : (
            <button
              onClick={() => changeBookmark(props.article.id, 'add')}
              type="button"
              className="mt-5 inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Bookmark this article
              <span className="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-200 text-xs font-semibold text-blue-800">
                {article.users.length}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Article
