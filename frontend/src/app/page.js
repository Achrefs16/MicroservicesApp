"use client"; // Assurez-vous que c'est un Client Component

import Navbar from "../../src/components/Navbar";

import Main from "../../src/components/Main";
import { Toaster } from "react-hot-toast";



export default function Home() {



  

  return (
    <div>
      <Toaster />
      <Navbar />
     <Main />    
    </div>
  );
}
