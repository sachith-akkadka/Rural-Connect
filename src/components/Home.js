import React from 'react'
import Sidebar from './Sidebar'
import Middle from './Middle'
import { Grid } from '@mui/material'
import RightBar from './RightBar'
import background from '../images/grass-bg.jpg'

function Home({userData}) {
    return (
        <div style={{backgroundImage: `url(${background})`,height:"100%",padding:"20px"}}>
            <Grid container spacing={4}>
                <Grid item xs={3}>
                    <Sidebar userData={userData}/>
                </Grid>
                <Grid item xs={6}>
                    <Middle  userData={userData}/>
                </Grid>
                <Grid item xs={3}>
                    <RightBar/>
                </Grid>
            </Grid>
            <footer
  style={{
    backgroundColor: "transparent",
    color: "Black",
    textAlign: "center",
    padding: "5px",
    fontSize: "18px"
  }}
>
  <p><b>© 2024 Rural Connect. All rights reserved.</b></p>
</footer>

        </div>
    )
}

export default Home
