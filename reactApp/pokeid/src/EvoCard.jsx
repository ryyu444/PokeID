import React from "react";

const EvoCard = ({ card }) => {
  return (
    <div className='Evolutions' > {/* Card that displays for each pokemon evolution */}
      <div className='evo_card'>
        <img className="evo_sprite" src={`${card.pokeSprites ? card.pokeSprites.front_default : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBCQSlOc0PRILMM5FCtsmAgSrMmjWY2QUHNw&usqp=CAU}'}`}/>
      </div>

      <div className='evo_name'>
        <p>{card.pokeName ? card.Title(card.pokeName) : 'Pokemon Finder'} </p>
          <p>{`ID: ${card.pokeID ? card.pokeID : 'Unknown'}`} </p>
        </div>
    </div>    
  )
}

export default EvoCard;