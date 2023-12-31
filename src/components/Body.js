    import { useContext, useEffect, useState } from "react";
    import { RestaurantCard } from "./RestaurantCard"
    import { filterData } from "../Utils/Helper";
    import { Link } from "react-router-dom";
    import useOnline from "../Utils/useOnline";
    import UserContext from "../Utils/UserContext";
    import Bhimmer from "./Bhimmer";
    import { IMG_CDN_URL } from "./Constants";
    import '../App.css'
    import { MdSearch } from 'react-icons/md'
    import SimpleSlider from "../Utils/useCarousel";


    const Body = () => {
    const [allRestaurant, setAllRestaurant] =useState();
    const [filteredRestaurant, setFilteredRestaurant] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const {user ,setUser } = useContext(UserContext)
    const [filteredOffer, setFilteredOffer] = useState([]);
    const [latestOffer, setLatestOffer] = useState([])
    const [currentIndex, setCurrentIndex ] = useState(0);
    const [currentIndexOffer, setCurrentIndexOffer ] = useState(0);



    useEffect(()=>{
        getRestaurant();
        },[])

    useEffect(() =>{
        const data = filterData(searchInput, allRestaurant)
        setFilteredRestaurant(data);
    }, [searchInput, allRestaurant])


    async function getRestaurant(){
    const data = await fetch("https://www.swiggy.com/dapi/restaurants/list/v5?lat=30.6884695&lng=76.7260057&page_type=DESKTOP_WEB_LISTING");

    const json = await data.json();
    const restaurant_array = (json?.data?.cards[2]?.card?.card?.gridElements?.infoWithStyle?.restaurants)
    const offerLatest =  json?.data?.cards[0]?.card?.card?.gridElements?.infoWithStyle?.info;
    const offerCards =  json?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.info;
    console.log(restaurant_array)
    setAllRestaurant(restaurant_array);
    setFilteredRestaurant(restaurant_array);
    setLatestOffer(offerLatest)
    setFilteredOffer(offerCards)
    }

    const goToPreviousOffer = () =>{
        setCurrentIndexOffer((prevIndex) => (prevIndex - 1 + latestOffer.length) % latestOffer.length)
    }
    const goToPrevious = () =>{
        setCurrentIndex((prevIndex) => (prevIndex - 1 + filteredOffer.length) % filteredOffer.length)
    }
    const goToNextOffer = () =>{
        console.log('press next')
        setCurrentIndexOffer((prevIndex) => (prevIndex + 1) % latestOffer.length); 
    };

    const goToNext = () =>{
        console.log('press next')
        setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredOffer.length); 
    };



        // const isOnline = useOnline();

        // if (!isOnline){
        //     return <h1>  Offline, Please check Internet connection</h1>
        // }


        // if (!allRestaurant) return null;

        // if (filteredRestaurant?.length === 0 && allRestaurant?.length !== 0) {return <h1>No restaurant matched your filter</h1>}


    console.log(latestOffer, 'latestoffer')

        return (!allRestaurant) ? <Bhimmer/>: (
            <>
             <div className="justify-items">
                <div className="font-serif font-semibold text-2xl pl-10 mt-10 mb-5 text-left">Best offers for you</div>
                </div>
            <div className="justify-between flex flex-col items-center">
            <div className="flex flex-wrap justify-between">
            <div className="flex pr-2 pt-4">
           <div className="flex">
            <button onClick={goToPreviousOffer} className="carousel-button prev-button rounded-full flex items-center justify-center">&#10094;</button>
                </div>
                <div className="w-86 h-56 gap-5 flex flex-horizontal justify-center">
                {
                    (!latestOffer) ? <div className="font-serif text-2xl mt-10">No Active Offers</div> :
                    latestOffer.map((offer, index) =>
                    <img src={IMG_CDN_URL + offer.imageId} key={offer.id} alt= {`Offer ${index}`} 
                    className= {`ml-8 w-86 h-56 ${index >= currentIndexOffer && index < currentIndexOffer + 3? "block" : "hidden"}`}
                    />
                    )
                }
                </div>
                </div>
            <button onClick={goToNextOffer} className="carousel-button next-button">&#10095;</button>
              </div>
                </div>

            <div className="font-serif font-semibold text-2xl pl-10 mt-10">What's on your mind?</div>
            <div className="w-86 h-56 gap-5 flex flex-horizontal justify-center">
            <button onClick={goToPrevious} className="carousel-button prev-button rounded-full flex items-center justify-center">&#10094;</button>
            
            {
                (!filteredOffer) ? <div className="font-serif text-2xl mt-10">No Active Offers</div> :
                filteredOffer.map((offer, index) =>
                <img src={IMG_CDN_URL + offer.imageId} key={offer.id} alt= {`Offer ${index}`} 
                className= {`w-56 h-56 ${index >= currentIndex && index < currentIndex + 4? "block" : "hidden"}`}
                />
                )
            }
                
            <button onClick={goToNext} className="carousel-button next-button">&#10095;</button>
            
            </div>
            <div className="font-serif font-semibold text-2xl pl-10 mt-10">Top restaurant chains in Chandigarh</div>
            <div className="search-contain flex flex-wrap justify-center">
            <input type="text" className="search-input pl-2 ml-10" placeholder="Search restaurants" value={searchInput}
                onChange={(e)=>setSearchInput(e.target.value)}
            />
            <div className="pl-1">
            <MdSearch size={30} color="gray"
            onClick = {()=> {
            const data = filterData(searchInput, allRestaurant)
            console.log(allRestaurant)
            setFilteredRestaurant(data)
            } } />  
            </div>
            </div> 
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center pl-20 pr-20 mt-5">
            {
            filteredRestaurant.map((restaurant) => {
            return (
                <Link to={"/restaurant/" + restaurant.info.id} key={restaurant.info.id}>
                <div className="flex flex-col items-center">
                <RestaurantCard {...restaurant.info} key={restaurant.info.id} user={user}/>
                </div>
                </Link>
            )})}
            </div>
            </>)
        
    }


    export default Body;