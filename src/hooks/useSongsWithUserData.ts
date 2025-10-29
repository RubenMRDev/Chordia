import { useState, useEffect } from 'react'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { getAllSongs } from '../firebase/songService'

export interface DisplaySong {
  id: string
  title: string
  key: string
  timeSignature: string
  tempo: number
  username: string
  userId: string
  createdAt: string
  difficulty?: number
}

export const useSongsWithUserData = () => {
  const [songs, setSongs] = useState<DisplaySong[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSongsWithUserData = async () => {
    try {
      setLoading(true)
      const allSongs = await getAllSongs()
      const songsWithUserData = await Promise.all(
        allSongs.map(async (song) => {
          let username = '@user'
          try {
            const userDoc = await getDoc(doc(db, 'users', song.userId))
            if (userDoc.exists()) {
              username =
                '@' +
                (userDoc.data().username ||
                  userDoc.data().displayName ||
                  userDoc.data().email?.split('@')[0] ||
                  'user')
            }
          } catch (err) {
            console.error('Error fetching user data:', err)
          }
          return {
            id: song.id || '',
            title: song.title,
            key: song.key,
            timeSignature: song.timeSignature,
            tempo: song.tempo,
            username,
            userId: song.userId,
            createdAt: song.createdAt,
          }
        })
      )
      setSongs(songsWithUserData)
    } catch (error) {
      console.error('Error fetching songs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSongsWithUserData()
  }, [])

  return { songs, loading, refetch: fetchSongsWithUserData }
}
