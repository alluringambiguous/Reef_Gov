import React from 'react'
import "./Dashboard.css"
import SideNav from '../components/SideNav'
import MainDash from "../components/MainDash"


function Dashboard() {
  return (
    <div className='dashboardContainer'><SideNav/><div><MainDash/></div></div>
  )
}

export default Dashboard