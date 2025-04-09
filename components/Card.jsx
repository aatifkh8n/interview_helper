import React from 'react'

const Card = () => {
  return (
    <div 
      key={card.title}
      className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center"
    >
      {card.icon}
      <div className="ml-4">
        <p className="text-xs sm:text-sm text-gray-500">{card.title}</p>
        <p className="text-xl sm:text-2xl font-bold text-gray-800">{card.value}</p>
      </div>
    </div>
  )
}

export default Card