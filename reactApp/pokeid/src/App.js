import React, {useState, useEffect} from 'react';
import './App.css';

const Title = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function App() {
  // Holds input, search input, & pokeData from fetch req
  const [input, setInput] = useState('Piplup'); // set default to piplup 
  const [search, setSearch] = useState('');
  const [pokeData, setPokeData] = useState([]);

  // Holds Pokemon information
  let pokeID = pokeData.id; // 'id': pokedex num
  let pokeName = pokeData.name; // 'name': pokemon
  let pokeType = pokeData.type; // [{0: type: name}, {1: type2: name}, ...]
  let pokeSprites = pokeData.sprites; // ['dir1': url, 'dir2': url2, ...]
  let pokeHeight = pokeData.height;
  let pokeWeight = pokeData.weight;
  let pokeStats = pokeData.stats; 
  let damageFrom = pokeData.damageFrom;
  let typeLength = 0;
  if(pokeType){
    typeLength = pokeType.length;
  }
  
  // Fetches Pokemon data upon search request
  useEffect(() => {

    fetch(`http://localhost:4000/pokemon_by_id?id=${input ? input.toLowerCase() : '?offset=20&limit=150'}`,
    {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      }
    )
    .then((res) => {
    if (res.ok) {
      return res.json();
    }
    throw new Error('Something went wrong')
    })
    .then((responseJson) => {
      console.log(responseJson)
      if(responseJson['success'] == false){
        alert("Incorrect name or ID")
      }
      else{
        setPokeData(responseJson.data)
      }

   })
   .catch((err) => {
      console.log(err.message);
      setPokeData("piplup");
   });
  },[search]);

  let renderType = <div></div>

  if(typeLength == 2){
    renderType = 
      <div>
          <p className="typeDisplay text" id = {pokeType ? pokeType[0] : 'Unknown'}>{`${pokeType ? Title(pokeType[0]) : 'Unknown'}`} </p>
          <p className="typeDisplay text" id = {pokeType ? pokeType[1] : 'Unknown'}>{`${pokeType && 1 in pokeType ? Title(pokeType[1]) : 'Unknown'}`} </p>
      </div>
  } else {
    renderType = 
      <div className="typeDisplay">
          <p className="text" id = {pokeType ? pokeType[0] : 'Unknown'}>{`${pokeType ? Title(pokeType[0]) : 'Unknown'}`} </p>
      </div>
  }

  // create objects for strong against and weak against
  let weak = []
  let strong = []
  if(damageFrom){
    for(let i = 0; i < damageFrom.length; i++) {
      if(damageFrom[i]['multiplier'] > 1){
        weak.push(<div className="text" id = {damageFrom[i]['type']}>{Title(damageFrom[i]['type'])}</div>)
      }
      if(damageFrom[i]['multiplier'] < 1){
        strong.push(<div className="text" id = {damageFrom[i]['type']}>{Title(damageFrom[i]['type'])}</div>)
      }
    }
  }

  // Add classes that hide or show certain aspects like the ID, Type, Name, etc
  // Need to add ALL types of a Pokemon
  return (
    <div className='InputContainer'>
      <h1>Type in your favorite Pokemon's name!</h1> 
      <div id ="searchEngine"> {/* Contains the search bar and button in a flex box to help center items*/}
        <input value={input} id = "searchBar" placeholder='Please enter a Pokemon' onChange={e => setInput(e.target.value)}/>
        <button id= 'searchButton' onClick={() => {setSearch(input)}}>Search</button>
      </div>
      
      <div className='Display'> {/* The card that will have all the pokemon information*/}

        {/* Information is divided into 3 rows based on figma design*/}
        <div id="displayRowOne"> {/* Contains name, ID, sprite, and type(s)*/}
          <div> {/* Div that holds the pokemon name and ID to be displayed on left side*/}
            <p className="text">{pokeName ? Title(pokeName) : 'Pokemon Finder'} </p>
            <p className="text" id = "alignLeft">{`#${pokeID ? pokeID : 'Unknown'}`} </p>
          </div>
          <img className = "sprite" src={`${pokeSprites ? pokeSprites : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBCQSlOc0PRILMM5FCtsmAgSrMmjWY2QUHNw&usqp=CAU}'}`}/>
          {renderType}
          <div>
            <p className="text">{`Weight: ${pokeWeight ? pokeWeight / 10 : 'Unknown'}`}kg</p>
            <p className="text">{`Height: ${pokeHeight ? pokeHeight / 10 : 'Unknown'}`}m</p>
          </div>
        </div>
        <hr></hr>

        <div id="displayRowTwo">
          <div id = "statsList">
            <div className="text2">{`HP: ${pokeStats ? pokeStats[0]['statValue'] : 'Unknown'}`} </div>
            <div className="text2">{`Attack: ${pokeStats ? pokeStats[1]['statValue'] : 'Unknown'}`} </div>
            <div className="text2">{`Special Attack: ${pokeStats ? pokeStats[3]['statValue'] : 'Unknown'}`} </div>
          </div>
          <div id = "statsList">
            <div className="text2">{`Speed: ${pokeStats ? pokeStats[5]['statValue']: 'Unknown'}`} </div>
            <div className="text2">{`Defense: ${pokeStats ? pokeStats[2]['statValue']: 'Unknown'}`} </div>
            <div className="text2">{`Special Defense: ${pokeStats ? pokeStats[4]['statValue'] : 'Unknown'}`} </div>
          </div>
        </div>
        <hr></hr>

        <div id="displayRowThree">
          <div className="typesListS">
            <p className="text">Strong Against:</p>
            {strong.map(type => (
              <div>
              <div>{type}</div> 
              </div>
            ))}
          </div>

          <div className="typesListW">
            <p className="text">Weak Against: </p>
            {weak}
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
