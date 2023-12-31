'use client'

import Image from 'next/image'
import { useState } from 'react'
import { player } from '@prisma/client'

export default function PlayerTile({
  player,
}: {
  player: player,
}) {
  const { id, login, first_name, last_name, email, born } = player
  const born_string = born == null ? "Unknown" : born.toLocaleDateString('sv')

  const [errorImage, setErrorImage] = useState<boolean>(false)
  const errorImageUrl = "http://localhost:3880/footy/images/mugshots/manofmystery.jpg"

  const url = errorImage ? errorImageUrl : "http://localhost:3880/footy/images/mugshots/" + login + ".jpg"

  return (
    <div className="w-[250px] rounded overflow-hidden shadow-lg" key={id}>
      <Image
        className="w-full"
        width={250}
        height={250}
        src={url}
        alt={first_name || "Player"}
        onError={(e) => {
          if (!errorImage) {
            setErrorImage(true)
            console.log(e)
          }
        }}
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{first_name} {last_name}</div>
        <p className="text-gray-700 text-base">{email}</p>
        <p className="text-gray-900 text-xl">{login}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          {born_string}
        </span>
      </div>
    </div>
  )
}
