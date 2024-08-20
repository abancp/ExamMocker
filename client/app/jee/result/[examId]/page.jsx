'use client'
import React from 'react'
import Header from '../../../../components/Header'


function Page(){
return(
<div className="h-screen w-full flex justify-center p-40">
  <Header/>
  <table border="10"  className=" h-fit  border border-blue-400 ">
    <tr><th>subject</th><th>attended questions</th><th>gained mark</th><th>right</th><th>wrong</th><th>not attended</th><th>total questions</th><th>percentile</th><th>rank</th></tr>
    <tr><th>mathematics</th><th>17</th><th>33</th><th>10</th><th>7</th><th>13</th><th>30</th><th>97.3452</th><th>rank</th></tr>
  </table>
</div>
)
}

export default Page
