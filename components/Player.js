import Image from 'next/image'
import React, { useState } from 'react'

export default function Player({ player }) {
  const { id, is_admin, login, first_name, last_name, email, joined, finished, born, introduced_by, comment, anonymous, goalie } = player

  const [errorImage, setErrorImage] = useState(null)
  const errorImageUrl = "/images/mugshots/manofmystery.jpg"

  const url = errorImage ? errorImageUrl : "/images/mugshots/" + login + ".jpg"

  return (
    <div
      className="w-[250px] rounded overflow-hidden shadow-lg"
      key={player.id}
    >
      <Image
        className="w-full"
        width={250}
        height={250}
        src={url}
        alt={first_name}
        onError={(e) => {
          if (!errorImage) {
            setErrorImage(true)
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
          {born}
        </span>
      </div>
    </div>
  )
}
