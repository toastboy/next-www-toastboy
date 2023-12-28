import Head from 'next/head'
import Player from '../components/Player'
import prisma from '../lib/prisma'

export default function Home({ players }) {
  return (
    <div>
      <Head>
        <title>Toastboy FC</title>
        <meta name="description" content="Toastboy FC: five-a-side footy on Tuesdays at Kelsey Kerridge, Cambridge" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-10 mx-auto max-w-4xl">
        <h1 className="text-6xl font-bold mb-4 text-center">Tuesday Footy Players</h1>
        <p className="mb-20 text-xl text-center">
          🔥 I mean, look at them 🔥
        </p>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 justify-items-center  gap-4">
          {players.map((player) => (
            <Player player={player} key={player.id} />
          ))}
        </div>
      </main>

      <footer>
      </footer>
    </div>
  )
}

export async function getStaticProps(context) {
  const data = await prisma.player.findMany({
    where: {
      finished: {
        equals: null,
      },
    },
  })

  // Make sure things are serialisable as JSON
  const players = data.map((player) => ({
    ...player,
    born: player.born == null ? "" : player.born.toLocaleDateString('sv'),
    finished: player.finished == null ? "" : player.finished.toLocaleDateString('sv'),
    joined: player.joined == null ? "" : player.joined.toLocaleDateString('sv'),
  }))
  return {
    props: { players },
    revalidate: 10,
  }
}
