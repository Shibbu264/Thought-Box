"use client"
import { useEffect, useRef, useState } from "react"
import { useSession } from 'next-auth/react';
import { Hearts } from "react-loader-spinner";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSocket } from "@/context/socket";
import {showToast} from "../components/toast";



export default function Note() {
  
  const { data: session, status } = useSession()
  const [title, settitle] = useState("Title")
  const [showcontent, setshowcontent] = useState(false)
  const [content, setContent] = useState("")
  const [loader, setloader] = useState(true)
  const router = useRouter()
  const noteid1 = router.query.noteid
  const [Noteidaftersaving, setnoteid] = useState("")
  const [addoption, setaddoption] = useState(false)
  const ab = useRef(false)

  const [Collaborators, setCollaborators] = useState('');

   async function getwindowurl(){
console.log(window.location.href)
navigator.clipboard.writeText(window.location.href)
showToast(" Copied to Clipboard !")

  }
 
  const socket = useSocket()

  useEffect(() => {
    console.log(socket)
    if (socket) {
      socket.on('content update', (newContent) => {
        setContent(newContent);
        console.log("Updating content")
      });
      socket.on('title update', (newTitle) => {
        settitle(newTitle);
        console.log("Updating content")
      });

      return () => {
        socket.off('content update');
      };
    }
  }, [socket]);

async function addCollaborator(){
  try{
 const response = await fetch("/api/addcollaborator",{
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    noteid:noteid1,
    Collaborator:Collaborators
  })
 })
 const data=await response.json()
 showToast(data.message)
  }
  catch (error){
    console.log(error)
  }
}



  async function savenotes(noteid) {
    try {
      const response = await fetch("/api/notesave", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          noteid: noteid, userid: session?.user?.email

        })
      })
      const data = await response.json()

      if (data.post.Collaborators.includes( session.user.email)) {
        setnoteid(data.post.id)
        settitle(data.post.title)
        setContent(data.post.content)
        setshowcontent(true)
      }
      setloader(false)
    }

    catch (e) {
      alert("Error: " + e)
      window.location.replace("/")
    }
  }


  
  useEffect(
    () => {
      
      if (status == "authenticated" && !ab.current) {
        ab.current = true
        savenotes(noteid1)
       
      
      }
      else if(status=="unauthenticated"){
        sessionStorage.setItem("url",window.location.href)
        window.location.replace("/signin")
      }
      return ()=>{
        sessionStorage.clear()
        
      }

    }
    , [status])

  async function savedata() {

    await fetch("/api/savedata", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        noteid: noteid1, userid: session?.user?.email
        , title: title, content: content
      })
    })
    console.log("data saved!")

  }


  return (
    <div>

      {loader ?
        <div className="flex items-center justify-center h-screen">
          <div className="block text-center">
            <h1 className="my-1 sm:text-4xl text-xl font-semibold text-[#D7EDE9]">Creating your space...</h1>
            <Hearts
              height="140"
              width="140"
              color="#4fa94d"
              ariaLabel="hearts-loading"
              wrapperStyle={{}}
              wrapperClass="flex items-center justify-center"
              visible={true}
            />
          </div>
        </div>
        :
        showcontent ?
          <div className="my-6">
            <div className="flex flex-col items-center gap-5  justify-center">
              <input value={title} onChange={(e) => {
                
                socket?.emit('update title', e.target.value)
                const value = e.target.value
                settitle(e.target.value)
                savedata()

                
              }} className="block px-2 text-4xl placeholder:text-white border-0 focus:border-none text-center text-white bg-black min-w-72 h-fit min-h-16 w-fit" type="text" ></input>
              <textarea value={content} onChange={ (e) => {
                setContent(e.target.value)
                const value = e.target.value; if (value[value.length - 1] === ' ' || value[value.length - 1] === '.') {
                  socket?.emit('update content', e.target.value)
                  savedata()
                } 
               

              }} id="message" className="h-fit p-2.5 min-w-[80%] sm:min-h-[500px] w-fit font-semibold  text-2xl text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here..."></textarea>

              {!addoption ? <button onClick={() => setaddoption(true)} className="my-1 hover:text-black text-white border-white border font-semibold hover:bg-white px-4 rounded-md py-2 block mx-auto">{'Add Collaborators !'} </button>
                :
                <div className="sm:flex flex-col  justify-center gap-[5%]">
                  <form >
                    <label for="search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div className="relative flex justify-between">

                      <input type="search" onChange={(e) => { setCollaborators(e.target.value) 
                     
                    }} 
                    
                    value={Collaborators}

                        id="search" className="block min-w-80 p-4  text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Email" required />
                      <button onClick={addCollaborator} type="button" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add</button>
                    </div>
                  </form>
                  <button onClick={() => setaddoption(false)} className="my-1 hover:text-white text-white w-fit border-white border font-semibold hover:bg-red-500 px-2 rounded-md py-1 block mx-auto">Cancel </button>
                  
                 
                </div>
              }
              <button onClick={getwindowurl} className="my-1 hover:text-white text-white w-fit border-white border font-semibold hover:bg-red-500 px-2 rounded-md py-1 block mx-auto">Copy link to notes ! </button>
              <Link href="/home"> <button className="mt-2 mb-1 hover:text-black text-white border-white border font-semibold hover:bg-white px-4 rounded-md py-2 block mx-auto">{'BACK =>'} </button></Link>



            </div>
          </div> : <h1 className="red-500 text-3xl flex justify-center my-[10%] ">
            Access to this note is restricted! Contact the Author !
          </h1>
      }


    </div>

  )
}












