import { db } from 'api/src/lib/db'

export default async () => {
  await db.playerStats.deleteMany({
    where: {
      liveGameSessionId: null
    }
  })
  console.log('Deleted legacy player stats with null liveGameSessionId')
}
