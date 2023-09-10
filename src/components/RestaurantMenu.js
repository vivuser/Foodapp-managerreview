import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IMG_CDN_URL } from './Constants';
import Shimmer from './Shimmer';
import useRestaurant from '../Utils/useRestaurant';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, decrementItem, removeItem } from '../Utils/cartSlice.js';
import { filterMenu } from '../Utils/searchMenu';
import  veg  from '../Utils/vegImage.png'
import  nonVeg  from '../Utils/nonVeg.png'
import { MdSearch } from 'react-icons/md';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';


const RestaurantMenu = () => {

  const { resId } = useParams();

    const { restaurant, menuItems, title, restaurantName, wholeData } = useRestaurant(resId);
  const cartItems = useSelector((store) => store.cart.items);

  const dispatch = useDispatch()

  const [count,setCount] = useState({});
  const [decount, setDecount] = useState({});
  const [searchMenu, setSearchMenu] = useState("")
  const [filteredMenu, setFilteredMenu] = useState([])
  const [sortOrder, setSortOrder] = useState('default')
  const [showVeg, setShowVeg] = useState(false)
  const [category, setCategory] = useState([])
  const [show, setShow] = useState(true)
  const [isAdded, setIsAdded] = useState({})


  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    dispatch({type:'SET_CART', payload: savedCart});

    const initialCount = savedCart.reduce((countObj, cartItem) => {
      const itemId = cartItem?.item?.id;
      if (itemId !== undefined) {
        countObj[itemId] = (countObj[itemId] || 0) + 1;
      }
      return countObj;
    }, {})
    setCount(initialCount);
  },[])

  const changeShowState = () =>{
    setShow(!show);
  }

  const handleVegToggle = () => {
    setShowVeg(!showVeg)
    const vegFilter = [...filteredMenu].filter(v => (showVeg ? v.card.info.isVeg : true))
    console.log(vegFilter)
    setFilteredMenu(vegFilter)
  } 

  const sortHighToLow = () =>{
    const sortedMenu =[...filteredMenu].sort((a,b)=> b.card.info.price - a.card.info.price)
    setFilteredMenu(sortedMenu);
    }

  const sortLowToHigh = () => {
    const sortedMenu = [...filteredMenu].sort((a,b) => a.card.info.price - b.card.info.price)
    setFilteredMenu(sortedMenu)
  }

  const sortDefault = () => {
    setFilteredMenu(filteredMenu)
  }

  const handleSortingChange = (event) =>{
    const selectedValue = event.target.value;
    setSortOrder(selectedValue)

    if (selectedValue === 'highToLow') 
      {
        sortHighToLow();
      }
      else if (selectedValue === 'lowToHigh')
      {
        sortLowToHigh();
      }
      else {
        sortDefault();
      }
  }


  useEffect(() =>{
    const data = filterMenu(searchMenu, menuItems)
    setFilteredMenu(data);
    setCategory(title)
  },[searchMenu, menuItems]);


  const handleCount=(itemId) =>{
    const updatedCount = {...count}
    updatedCount[itemId] = (updatedCount[itemId] || 0) + 1
    setCount(updatedCount)
   };

  const handleDecount= (itemId) =>{
    const updatedCount = {...count}
    updatedCount[itemId] = updatedCount[itemId] >0? (updatedCount[itemId] || 0) -1 : 0;
    setCount(updatedCount)
  }

  const handleAddItem = (item) => {
    dispatch(addItem({item}))
    handleCount(item.id);

    const updatedCart = [...cartItems, item];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  }

  const handleAddToCart = (item) => {
    const updatedIsAdded = {...isAdded};
    updatedIsAdded[item.id] = true;
    console.log(item)
    setIsAdded(updatedIsAdded)
    dispatch(addItem({item}))
  }

  const handleSubtractItem = (item) =>{
    if (count[item.id] > 0) {
    dispatch(decrementItem ({item}))
    }
    handleDecount(item.id)
  }

  const totalItems = Object.values(count).reduce((total, quantity) => total + quantity,0)
  console.log(filteredMenu)


  const boilerCart = [] 
    
  {if(wholeData) {
  wholeData.map((item) => (
        boilerCart.push(item.card.card)
  ))
  }}
  console.log(wholeData)
  console.log(boilerCart)
  
  const all = []
  boilerCart.map(item => {
      all.push(item)
  })
console.log(all)

const every = []
all.map(item => {
    every.push(item.itemCards)
})
console.log(every)

const allEvery =[]
every.map(item =>{
    (item?.map((item) => {
      allEvery.push(item?.card?.info?.name)
    }))})

console.log(allEvery)

  // console.log(filteredMenu)
  // console.log(menuItems)
  
  return !restaurant ? (
    <Shimmer /> 
  ) : (
    <div className='gap-8'>
      {/* ... (restaurant info) */}
      <div>
        <input className='ml-5 pl-2' type='text' placeholder='search menu' value={searchMenu}
        onChange={(e)=> {setSearchMenu(e.target.value)}} />
        <MdSearch size={30} color="gray"
        onClick={()=>{
          const data = filterMenu(searchMenu, menuItems)
          console.log(data)
          setFilteredMenu(data)
        }}
        />
           <button   className={`ml-4 px-2 py-1 rounded-md ${
    showVeg ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
  }`} onClick={handleVegToggle}>
        show only veg
      </button>
        <div className='flex justify-end pr-6'>
        <select value={sortOrder} onChange={handleSortingChange}>
        <option value="highToLow">High To Low</option>
        <option value="lowToHigh">Low To High</option>
        <option value="default">Default Sort</option>
        </select>
        </div>
        <div className='flex flex-row mt-2 max-w-5xl mx-auto'>
        <div className='pl-10'>
      <div className='font-bold'>{restaurantName.name}</div>
      <div className='font-serif'>{restaurantName.cuisines.join()}</div>
      <div className='font-serif'>{restaurantName.city}</div>
      </div>
        <div className='ml-auto pr-10'>
        <div>{restaurantName.avgRating}<FontAwesomeIcon color='gray' icon={faStar} /></div>
        <div>{restaurantName.totalRatingsString}</div>
      <div className='font-bold'>{restaurantName.costForTwoMessage}</div>
        </div>
      </div>
      <hr className='border-dashed border-gray-400 m-8'></hr>
      </div>




      {!all ? (
    <Shimmer />
  ) : (
    all.map((item, index) => (
  <div key={index} className='font-bold pl-10 pr-10'>
  {item?.categories ?
  <button id={index}
      className='font-bold text-left h-10 bg-gray-200 ml-14 mr-11 mt-5 p-2 relative select-none flex space-between' onClick={changeShowState}>{item?.title} ▼
      </button> : null} 
    { 
      item?.categories?.map((subItem, subIndex) => (
      subItem?.itemCards?.map((tubItem, tubIndex) => (<>
        {tubItem?.card?.info?.imageId ?
        <div key={tubIndex}>
        <div className='relative flex flex-row justify-between p-7 tubItem max-w-5xl mx-auto'>
        <div className='flex flex-col'>
        <div key={tubIndex} className='font-medium'>{tubItem?.card?.info?.name}</div>
        {tubItem?.card?.info?.price ? 
          <div key={tubIndex} className='font-medium'>₹{tubItem?.card?.info?.price/100}</div>:
        <div key={tubIndex} className='font-medium'>₹{tubItem?.card?.info?.variantsV2.pricingModels[0].price/100}</div>
        }
        <div key={tubIndex} className='font-thin font-serif text-sm'>{tubItem?.card?.info?.description}</div>
        </div>

        <div key={tubIndex} className='absolute bottom-5 right-10'>
        {isAdded[tubItem.card.info.id] ? (
          <div>
          <button className='text-green-600 pl-4 pr-2 border rounded-1-md h-8 justify-end bg-white text-md'
          onClick={() => handleSubtractItem(tubItem.card.info)}
          >
          -
          </button>
          <span className='border-t border-b bg-white p-1 text-md text-green-600' >
            {count[tubItem.card.info.id] || 1}
          </span>
          <button 
          className='text-green-600 pl-4 pr-2 border rounded-1-md h-8 justify-end bg-white text-md'
          onClick={() => handleAddItem(tubItem.card.info)}
          >+
          </button>
          </div>
        ) : (
          <button 
          className='text-green-600 pl-4 pr-6 mr-2 p-2 border rounded-md h-10 justify-end bg-white text-xs'
          onClick={() => handleAddToCart(tubItem.card.info)}
          >ADD</button>
        )
        }
         </div>




        <img className="w-28 h-28 ml-5" src ={IMG_CDN_URL + tubItem?.card?.info?.imageId}></img>
        </div>
        <hr className='border-t-2 border-gray-200 ml-10 mr-10'></hr>
        </div>
         : null
        }
      </>))))}
  </div>)))}
{/* {
all ? (
    <Shimmer />
  ) : (
    all.map((item, index) => (
  <div key={index} className='font-bold'>
        <button id={index}
      className='font-bold text-left w-full h-10 bg-gray-200 ml-14 mr-11 mt-5 p-2 relative select-none flex space-between' onClick={changeShowState}>{item?.title} ▼
      </button>
    {show && item?.categories?.map((subItem, subIndex) => (
      subItem?.itemCards?.map((tubItem, tubIndex) => (<>
      <div className='flex flex-row justify-between p-10 m-10 tubItem '>
        <div key={tubIndex} className='font-normal'>{tubItem?.card?.info?.name}</div>
        <img className="w-28 h-28" src ={IMG_CDN_URL + tubItem?.card?.info?.imageId}></img>
        </div>
        <hr></hr>
      </>))
    ))}
  </div>
))
  )
} */}




      <div className='pl-12 bg-gray-100 rounded-md p-4 m-8'>

      {/* {
      all.map((item, index)=> {
       <div className='font-bold'>{item.title}</div>

       item.itemCards?.map((subitem, index)=> {
          <div>{subitem?.card?.info?.name}kkkkkkkk</div>
        })

      })
        } */}
      {/* {
      allEvery.map((item, index)=> (
       <div>{item}</div>
      ))} */}
      <div>
        <img className='w-56 h-40' src = {IMG_CDN_URL+ restaurantName.cloudinaryImageId} alt={restaurantName.name} />
      </div>
      <div className='font-bold'>
        {restaurantName.name}
      </div>
        <div className=''>
        {restaurantName.cuisines.join()}
        </div>
        <div className=''>
        {restaurantName.city}
        </div>
        <div>
          {restaurantName.avgRating}
        </div>
        </div>

      <div className='flex'>
      <button 
      className='font-bold text-left w-full h-10 bg-gray-200 ml-14 mr-11 mt-5 p-2 relative select-none flex space-between' onClick={changeShowState}>{title} ▼
      </button>
      </div>
      {show &&
       Object.values(filteredMenu).map((item, index) => (<>
        <div className='flex flex-row justify-between p-2  mt-5 shadow-lg bg-white-20 pl-10 pr-10' key={index}>
        <div className='mb-2 flex flex-row'>
        <div>{item?.card?.info?.isVeg ? <img className ="w-5 h-5" src={veg} alt="Vegetarian Icon" />
        
 : <img className ="w-5 h-5" src={nonVeg} alt="nonVegetarian Icon" />}</div>
        <img className='w-36 h-29' src={IMG_CDN_URL + item?.card?.info?.imageId} alt={item?.card?.info?.name} />
        <div className='flex flex-col pl-2'>
        <div className='font-semibold'>{item?.card?.info?.name}</div>
        ₹{item?.card?.info?.price / 100}
        <div className='text-sm justify-center'>{item?.card?.info?.description}</div>

        </div>
        </div>
          <div className='flex justify-end space-x-2 h-8'>
            <button
              onClick={() => handleSubtractItem(item?.card?.info)}
              className='bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md ml-auto'
            >
              -
            </button>
            <span className='px-2 py-1'>{count[item?.card?.info?.id] || 0}</span>
            <button
              onClick={() => handleAddItem(item?.card?.info)}
              className='bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md'
            >
              +
            </button>
          </div>
        </div>
      </>))}
    </div>
  );
};

export default RestaurantMenu;