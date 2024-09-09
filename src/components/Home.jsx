import "../index.css";
import { React, useEffect, useState } from "react";
import Wheel from "./Wheel";
import { FaGear, FaGlobe, FaList, FaMap, FaMoon, FaRecordVinyl, FaRotateLeft, FaRotateRight, FaSun, FaTimeline, FaX } from 'react-icons/fa6';
import applaudSound from "../sounds/applaudSound.mp3";
import { useNavigate } from 'react-router-dom';
import useBreakpoint from './hooks/useBreakpoint';  // Adjust the path as necessary
import profile from '../assets/profile.png'
import { useAuthStore } from "../store";
import axios from 'axios';
import { toast } from 'react-toastify';


// import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from "./Confetti";
import { FaBars, FaHamburger, FaSignOutAlt } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { PiSignOut } from "react-icons/pi";
import { LazyResult } from "postcss";

function Home() {
  const navigate = useNavigate();
  const [spinning, setSpinning] = useState(false);
  const [winners, setWinners] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [visibility, setVisibility] = useState(false);
  const [confet, setConfet] = useState(false);
  const [themeMode, setThemeMode] = useState(false);
  const [layout, setLayout] = useState('winner');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const audio = new Audio(applaudSound)
  const isMobile = useBreakpoint('md').isBelowMd;
  const handleLogout = useAuthStore((state) => state. disauthenticate);
  const [userData, setUserData] = useState(() => {
    const data = window.localStorage.getItem("userdata");
    return data ? JSON.parse(data) : null;
  });
  const [spinRecords, setSpinRecords] = useState(() => {
    const data = window.localStorage.getItem("spinrecords");
    return data ? JSON.parse(data) : [];  // Default to an empty array
  });

  const [duration, setDuration] = useState(window.localStorage.getItem("duration"));
  const [wheelColor, setWheelColor] = useState(window.localStorage.getItem("wheelColor"));
  const [fontColor, setFontColor] = useState(window.localStorage.getItem("fontColor"));
  const [items, setItems] = useState(() => {
    const value = window.localStorage.getItem("itemsList");
    return value !== null ? JSON.parse(value) : [
      "30% SITEWIDE OFF",
    "BUY 1 GET 1 FREE",
    "PURCHASE WORTH 1000+",
    "BUY 2 EFFERVESCENT",
    "50G TEA OF RS. 500",
    "HOT CHOCOLATE TEA",
    ];
  });

  const [colors, setColors] = useState(() => {
    const value = window.localStorage.getItem("colorsList");
    return value !== null ? JSON.parse(value) : ["#ff0000", "#00ff00", "#0000ff", "#ff00ff", "#00ffff", "#ffff00"];
  });

  if (window.localStorage.getItem("duration") === null)
    localStorage.setItem("duration", 10);

  if (window.localStorage.getItem("wheelColor") === null)
    localStorage.setItem("wheelColor", "#E50303");

  if (window.localStorage.getItem("fontColor") === null)
    localStorage.setItem("fontColor", "#000000");

  function checkCoupon() {
    if (visibility===false){
      setVisibility(true);
    }else if (visibility===true){
      setVisibility(false);
      setOpenModal(false)
    }
  }

  function handleUserLogout() {
    const confirmed = window.confirm('Are you sure you want to Logout?');
    if (confirmed) {
        handleLogout();
    }
}



  function redeemCoupon() {
    var chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var couponlength = 8;
    var code = "";

    for (var i = 0; i <= couponlength; i++) {
      let randomNumber = Math.floor(Math.random() * chars.length);
      code += chars.substring(randomNumber, randomNumber + 1);
    }
    console.log(code);
    setCoupon(code);
    setVisibility(true);
  }

  const onCopyText = () => {
    navigator.clipboard.writeText(winners[newWinnerIndex]);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const selectResultEventHandler = (data) => {
    if (items.length > 0 && spinning !== true) {
      var selectedIndex = data;
      setSpinning(true);
      setTimeout(() => {
        setSpinning(false);
      }, window.localStorage.getItem("duration") * 1000);

      setTimeout(() => {
        setWinners(winners.concat(items[selectedIndex]));               
postSpinRecord(items[selectedIndex],colors[selectedIndex],userData._id);
getUserSpinRecord();
        console.log('winners',items[selectedIndex]);
        console.log('colors', colors[selectedIndex]);
      }, window.localStorage.getItem("duration") * 1000);

      setTimeout(() => {
        setOpenModal(true);
        setConfet(true);        
    audio.play();
    setTimeout(() => {
      setConfet(false);
      audio.pause();
    }, 6000);
      }, window.localStorage.getItem("duration") * 1000);
    }
  };


  const getDateString = (requestDate) => {    
    const date = new Date(requestDate);
    const day = date.toLocaleDateString('default', { day: 'numeric' });
    const month = date.toLocaleDateString('default', { month: 'short' });
    const dateString = `${month} ${day}, ${date.getFullYear()}, ${date.getHours() > 12 ? date.getHours() -12 : date.getHours()}:${date.getMinutes()}${date.getHours() > 12 ?'pm':'am'}`;
    return dateString;
    }


  function toggleModal() {
    setOpenModal(prevState => !prevState);
}

function handleOpenHistory() {
  setOpenModal(true);
  setLayout('history');
}


const postSpinRecord = async (item,color,user_id) => {
  setIsLoading(true);
  setErrorMessage(null);
  try {
    const response = await axios.post("https://yourlinkapp.vercel.app/api/spin/create", {
      title: item,
      color,
      user_id, // Sending the foreign key
    });
    toast.success(response?.data?.message||'Record Created Successfully'); 
  } catch (error) {
    setErrorMessage(error.response?.data?.message || "Record not Created and failed");
    toast.error(error.response?.data?.message || "Record not Created and failed"); 
  } finally {
    setIsLoading(false);
  }
};


const getUserSpinRecord = async () => {
  setIsLoading(true);
  setErrorMessage(null);
  try {
    console.log(userData._id);
    const response = await axios.get(`https://yourlinkapp.vercel.app/api/spin/get/${userData._id}`);
    const spinData = response.data.spinRecords;  // Extract the data from the response
    window.localStorage.setItem('spinrecords', JSON.stringify(spinData));  // Save only the data part
    setSpinRecords(spinData);  // Update state with the correct data
    console.log('spinrecords',spinRecords);
  } catch (error) {
    setErrorMessage(error.response?.data?.message || "Failed to fetch records");
  } finally {
    setIsLoading(false);
  }
};


const getUserSpinRecords = async () => {
  setIsLoading(true);
  setErrorMessage(null);
  try {
    console.log(userData._id);
    const response = await axios.get(`https://yourlinkapp.vercel.app/api/spin/get/${userData._id}`);
    const spinData = response.data.spinRecords;  // Extract the data from the response
    window.localStorage.setItem('spinrecords', JSON.stringify(spinData));  // Save only the data part
    setSpinRecords(spinData);  // Update state with the correct data
    toast.info(response?.data?.message || 'Records retrieved successfully')
    console.log('spinrecords',spinRecords);
  } catch (error) {
    setErrorMessage(error.response?.data?.message || "Failed to fetch records");
    toast.error(error.response?.data?.message || 'Unable to retrieve Records')
  } finally {
    setIsLoading(false);
  }
};
  

  let newWinnerIndex = winners.length - 1;

  useEffect(() => {
    window.localStorage.setItem("itemsList", JSON.stringify(items));
    window.localStorage.setItem("colorsList", JSON.stringify(colors));
  }, [items, colors]);

  
  // useEffect(() => {
  //   if (userData && userData._id) {
  //     getUserSpinRecords();
  //   }
  // });



  return (
    <div className="bg-[rgb(199, 249, 208)]">
        {openModal && confet && <Confetti />}
        <div className="bg-gradient-to-t from-green-600 to-green-400 flex justify-between p-2 md:px-4 lg:px-10 items-center sticky top-0 z-[10]">
          <div className="font-black text-white text-md md:text-xl lg:text-3xl" onClick={()=>{
            // localStorage.clear()
          }}>Wheel of Steel</div>
          <div className="text-sm md:text-md flex items-center cursor-pointer font-bold text-white" onClick={() => {}}>          
          <span className="flex" onClick={() => document.getElementById("my_modal_1").showModal()}>
          {!isMobile && 'Settings'}
          <FaGear onClick={() => document.getElementById("my_modal_1").showModal()}
        className="text-white text-xl md:text-2xl me-5"
        /></span>
      {!isMobile && 'Layout'}
      {!isMobile && <input
  type="checkbox"
  className="toggle border-green-400 bg-green-600 [--tglbg:rgb(199, 249, 208)] hover:bg-green-700 me-5"
  checked={openModal}
  onChange={(toggleModal)}
/>
}
      {!isMobile && <span className="flex cursor-pointer" onClick={handleUserLogout}>
      Logout
      <PiSignOut className="font-black text-lg md:text-2xl me-5" />
      </span>}
      
      {!isMobile && (userData.name || 'Username')}
<div className="flex-none">
    <div className="dropdown dropdown-end">
    {isMobile ?<div tabIndex={0} role="button" className="">
      <FaBars
        className="text-white text-2xl md:text-2xl me-5 mt-2 md: mt-0"
        />
      </div>:
        <div tabIndex={0} role="button" className="bg-white rounded-full btn btn-ghost rounded btn-circle">
      <img src={profile} className="card-img img-fluid rounded rounded-[100px]"  alt="" />
      </div>}
      <div
        tabIndex={0}
        className="card card-compact dropdown-content bg-base-100 z-[1] w-72 shadow">
        <div className="card-body items-center">
          <div className="card-body border items-center w-72">
        <div tabIndex={0} role="button" className="bg-black rounded-full btn btn-ghost rounded btn-circle w-[90px] h-[90px]">
        <img src={profile} className="card-img img-fluid rounded rounded-[100px]"  alt="" />
        </div>
        <div>
          <div className="text-lg font-bold flex justify-center text-black">{userData?.name || "Unknown"}</div>
          <div className="text-green-400 flex justify-center">{userData?.email || "email"}</div>
          </div>
          </div>
          <div className="card-actions">
          <button className={`btn rounded-[0px] justify-between w-72 text-black ${isCopied?'btn-info':'btn-ghost'}`} onClick={toggleModal}><FaGlobe /><span>{openModal? 'Close Layout': 'Open Layout'}</span><span> </span></button>
            <button className={`btn rounded-[0px] justify-between w-72 text-black ${isCopied?'btn-info':'btn-ghost'}`} onClick={handleOpenHistory}><FaList /><span>History</span><span> </span></button>
            <button className="btn rounded-[0px] btn-ghost justify-between w-full text-black" onClick={handleUserLogout}><PiSignOut /><label className="" htmlFor="my_modal_6"><span>Logout</span><span> </span></label><span> </span></button>
          </div>
        </div>
      </div>
    </div>
    </div>


</div>
      </div>
      <Modal
        items={items}
        setItems={setItems}
        wheelColor={wheelColor}
        setWheelColor={setWheelColor}
        fontColor={fontColor}
        setFontColor={setFontColor}
        colors={colors}
        setColors={setColors}
      />
      <section
        className="relative min-h-screen justify-evenly align-middle lg:flex md:flex-row sm:flex-row flex-row"
        style={{
          alignItems: "center",
          backgroundColor: "rgb(199, 249, 208)",
        }}
      >
        <Wheel
          items={items}
          onChange={selectResultEventHandler}
          spinning={spinning}
          wheelColor={wheelColor}
          fontColor={fontColor}
          colors={colors}
        />
        {openModal && (
          <div className="bg-gradient-to-t from-green-600 to-green-400  h-1/2  sm:w-full md:w-full lg:w-1/2 rounded-md my-3">
          <div className="justify-between flex"><span className={`border-4 border-green-600 ${layout==='winner'&&'bg-green-600 text-white'} rounded-tl-lg p-4 w-full hover:bg-green-500 cursor-pointer font-bold text-center`} onClick={()=>setLayout('winner')}>winner</span> <span className={`border-4 border-green-600 ${layout==='history'&&'bg-green-600 text-white'} p-4 w-full hover:bg-green-500 cursor-pointer font-bold text-center`} onClick={()=>setLayout('history')}>History</span> <span className={`border-4 border-green-600 ${layout==='setting'&&'bg-green-600 text-white'} rounded-tr-lg p-4 w-full hover:bg-green-500 cursor-pointer font-bold text-center`} onClick={()=>setLayout('setting')}>Setting</span></div>
            {layout === 'winner' ? <div
              className="p-10 flex flex-col justify-center font-bold"
              style={{ alignItems: "center" }}
            >
              <h1
                style={{ color: "#E50303" }}
                className="text-xl tracking-wide"
              >
                Congratulations we have a winner!!!
              </h1>
              <p>{winners[newWinnerIndex]}</p>
              <button
                onClick={checkCoupon}
                className="rounded-md p-3 text-lg bg-green-900 m-4"
              >
                {!visibility?'Copy the winner value':'Close this Entire Layout'}
              </button>
              {visibility && (
                <div className="flex items-center">
                  <p className="rounded-l-full  bg-green-200 p-2 px-2">
                    {/* {coupon} */}
                    {winners[newWinnerIndex]}
                  </p>
                  <button
                    onClick={onCopyText}
                    className="rounded-r-full bg-green-900 p-2 px-3"
                  >
                    Copy
                  </button>
                  <span
                    className={`${isCopied ? "block mx-1" : "hidden"} text-[red]`}
                  >
                    Copied!
                  </span>
                </div>
              )}
            </div>:layout === 'history' ? <div
              className="pb-10 pt-4 px-2 flex flex-col justify-center font-bold"
              style={{ alignItems: "" }}
            >           
            <div className="justify-center items-center w-full flex cursor-pointer" onClick={getUserSpinRecords}> 
              Reload
            <FaRotateLeft className="center"/>
            </div>  
              {spinRecords?.map((item, index)=> {
                const color = item.color;
                return (
                <div key={index} className="justify-between flex">
                  <span className="text-[10px] md:text-sm">{index + 1}. </span>
                  <span><span style={{backgroundColor: color}} className={`border border-3xl rounded rounded-[50px] px-3 bg-[${color}]`}></span>
                <span className="text-[10px] md:text-[12px] font-black text-center">{item.title}</span></span>
                <span className="text-[10px] md:text-[12px] text-center pt-2 font-normal">{getDateString(item.createdAt)}</span>
                </div>
                )})}
            </div>:layout === 'setting' ? <div
            className="pb-10 pt-0 px-10 flex flex-col justify-center font-bold"
            style={{ alignItems: "center" }}
          >
            <Setting
        items={items}
        setItems={setItems}
        wheelColor={wheelColor}
        setWheelColor={setWheelColor}
        fontColor={fontColor}
        setFontColor={setFontColor}
        colors={colors}
        setColors={setColors}
        setOpenModal={setOpenModal}
      />      
          </div>:<></>}
          </div>
        )}
      </section>
    </div>
  );
}



function Modal({ items, setItems, wheelColor, setWheelColor, fontColor, setFontColor, colors, setColors }) {
  // State for new item input
  const [newItem, setNewItem] = useState("");

  // Add new item to the list
  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setColors([...colors, "#d38c12"]); // Add a default color for the new item
      setNewItem("");
    }
  };

  const resetAll = () => {
    const defaultItems = [
      "30% SITEWIDE OFF",
    "BUY 1 GET 1 FREE",
    "PURCHASE WORTH 1000+",
    "BUY 2 EFFERVESCENT",
    "50G TEA OF RS. 500",
    "HOT CHOCOLATE TEA",
    ];
    const defaultColors = ["#ff0000", "#00ff00", "#0000ff", "#ff00ff", "#00ffff", "#ffff00"];
  
    // Reset the items and colors
    setItems(defaultItems);
    setColors(defaultColors);
  
    // Store the defaults in localStorage correctly
    window.localStorage.setItem("itemsList", JSON.stringify(defaultItems));
    window.localStorage.setItem("colorsList", JSON.stringify(defaultColors));
  };


  // Remove item from the list
  const removeItem = (index) => {
    if (items.length<=2){
      alert('minimum value is 2')
    } else {
    setItems(items.filter((_, i) => i !== index));
    setColors(colors.filter((_, i) => i !== index));
    }
  };

  // Update item color
  const updateColor = (index, newColor) => {
    const updatedColors = [...colors];
    updatedColors[index] = newColor;
    setColors(updatedColors);
  };

  // Update item color
  const updateTextColor = (newColor) => {
    localStorage.setItem("fontColor", newColor);
    setFontColor(window.localStorage.getItem("fontColor"))
  };

  // Handle modal close
  const closeModal = () => {
    document.getElementById("my_modal_1").close();  // Close the modal using the dialog's close method
  };

  return (
    <dialog id="my_modal_1" className="modal">
      <form method="dialog" className="modal-box">
      {/* Close button at the top */}
      <span className="modal-action cursor-pointer" onClick={closeModal}>
          <FaX className="bg-[red] text-white rounded-full p-1 text-xl" style={{ stroke: "white", strokeWidth: 2 }} />
        </span>

      <h3 className="font-bold text-lg">Edit Wheel Contents</h3>
        <li key={0} className="flex justify-end items-center my-2 font-bold">
              <span>Wheel Theme</span>
              <input
                type="color"
                value={fontColor}
                onChange={(e) => updateTextColor(e.target.value)}
              />
            </li>
        <ul>
          {items.map((item, index) => (
            <li key={index} className="flex justify-between items-center">
              <span className="text-[12px] md:text-sm w-1/2 my-0 md:my-2">{item}</span>
              <input
                type="color"
                value={colors[index]}
                onChange={(e) => updateColor(index, e.target.value)}
                className="w-1/12 md:text-lg"
              />
              <button
                className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-[10px] md:text-sm"
                onClick={() => removeItem(index)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new item"
          className="input input-bordered w-full mb-1"
        />
        <div className="justify-between flex">
        <button
          type="button"
          onClick={addItem}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Item
        </button>
              <button
                className="bg-black text-white px-4 py-2 rounded"
                onClick={resetAll}
              >
                Reset All
              </button>
              </div>
      </form>
    </dialog>
  );
}



function Setting({ items, setItems, wheelColor, setWheelColor, fontColor, setFontColor, colors, setColors, setOpenModal }) {
  // State for new item input
  const [newItem, setNewItem] = useState("");

  // Add new item to the list
  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setColors([...colors, "#d38c12"]); // Add a default color for the new item
      setNewItem("");
    }
  };


  const resetAll = () => {
    const defaultItems = [
      "30% SITEWIDE OFF",
    "BUY 1 GET 1 FREE",
    "PURCHASE WORTH 1000+",
    "BUY 2 EFFERVESCENT",
    "50G TEA OF RS. 500",
    "HOT CHOCOLATE TEA",
    ];
    const defaultColors = ["#ff0000", "#00ff00", "#0000ff", "#ff00ff", "#00ffff", "#ffff00"];
  
    // Reset the items and colors
    setItems(defaultItems);
    setColors(defaultColors);
  
    // Store the defaults in localStorage correctly
    window.localStorage.setItem("itemsList", JSON.stringify(defaultItems));
    window.localStorage.setItem("colorsList", JSON.stringify(defaultColors));
  };

  // Remove item from the list
  const removeItem = (index) => {
    if (items.length<=2){
      alert('minimum value is 2')
    } else {
    setItems(items.filter((_, i) => i !== index));
    setColors(colors.filter((_, i) => i !== index));
    setOpenModal(true);
    }
  };

  // Update item color
  const updateColor = (index, newColor) => {
    const updatedColors = [...colors];
    updatedColors[index] = newColor;
    setColors(updatedColors);
  };

  // Update item color
  const updateTextColor = (newColor) => {
    localStorage.setItem("fontColor", newColor);
    setFontColor(window.localStorage.getItem("fontColor"))
  };

  return (
    <div className="container">
      <form method="" className="container">
      <h3 className="font-bold text-lg">Edit Wheel Contents</h3>
        <li key={0} className="flex justify-end items-center my-2 font-bold">
              <span>Wheel Theme</span>
              <input
                type="color"
                value={fontColor}
                onChange={(e) => updateTextColor(e.target.value)}
              />
            </li>
        <ul>
        {items.map((item, index) => (
            <li key={index} className="flex justify-between items-center">
              <span className="text-[12px] md:text-sm w-1/2 my-0 md:my-2">{item}</span>
              <input
                type="color"
                value={colors[index]}
                onChange={(e) => updateColor(index, e.target.value)}
                className="w-1/12 md:text-lg"
              />
              <button
                className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-[10px] md:text-sm"
                onClick={() => removeItem(index)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new item"
          className="input input-bordered w-full my-2"
        />
        <div className="justify-between flex">
        <button
          type="button"
          onClick={addItem}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Item
        </button>
              <button
                className="bg-black text-white px-4 py-2 rounded"
                onClick={resetAll}
              >
                Reset All
              </button>
              </div>
      </form>
    </div>
  );
}




export default Home;
