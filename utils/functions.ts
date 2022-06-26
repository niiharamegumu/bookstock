import Router from 'next/router'
export async function changeBookmark(
  id: number,
  type: 'add' | 'remove'
): Promise<void> {
  await fetch(
    process.env.NEXT_PUBLIC_VERCEL_URL + `/api/bookmark/${type}/${id}`,
    {
      method: 'PUT',
    }
  )
  Router.reload()
}
