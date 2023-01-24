import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
/*
Fields
Charity name
Category name
Address (Country, state, city, postal)
*/

function Datagrids() {
    const apiId = "20472357"
    const apiKey = "11d6cc3af01966339329d5411fb30376"
    const apiLink = `https://api.data.charitynavigator.org/v2/Organizations?app_id=${apiId}&app_key=${apiKey}&pageSize=1000`
    const [dataPoint, setData] = useState([]);
    
    useEffect(() => {
        getCharityData()
    },[])
    const getCharityData = async() => {
        const check = localStorage.getItem('data')
        if (check) {
            setData(JSON.parse(check))
        } else {
            const api = await fetch(apiLink)
            const dataP = await api.json()
            localStorage.setItem('data', JSON.stringify(dataP))
            setData(dataP)
        }
    }
    console.log(dataPoint)
    // ein, 
    const cols = [
        {field: 'col1', headerName: 'Charity Name', width: 300},
        {field: 'col2', headerName: 'Total Revenue', width: 150},
        {field:'col3', headerName: 'Country', width: 150},
        {field:'col4', headerName: "State", width: 150},
        {field:'col5', headerName: "Zip", width: 150},
    ]

    const checkState = (state) => {
        if (state === 'CA' || 
            state === 'NY' || 
            state === 'TX' ||
            state === 'FL' ||
            state === 'IL') 
        {
            return true
        }
        return false
    }

    const filterRows = dataPoint.filter((val) => {
        const state = val.donationAddress?.stateOrProvince
        if (checkState(state)) 
        {
            return val
        }
    })


    // const getNewDetails = filterRows.map(async(val) => {
    //     const ein = val.ein
    //     const rating = val.currentRating.rating
    //     if (ein && rating) {
    //         const check = localStorage.getItem('dataP')
    //         if (check) {
    //             setData(JSON.parse(check))
    //         } else {
    //             const link = `https://api.data.charitynavigator.org/v2/Organizations/${ein}/Ratings/${rating}?app_id=20472357&app_key=11d6cc3af01966339329d5411fb30376`
    //             const api = await fetch(link)
    //             const data = await api.json()
    //             localStorage.setItem('dataP', JSON.stringify(data))
    //             setD(data)
    //         }
    //         return val
    //     }
    // })
    // console.log(getNewDetails)
    
    const rows = filterRows.map((val, index) => {
        const name = val?.charityName
        const ein = val?.ein
        const state = val.donationAddress?.stateOrProvince
        const city = val.donationAddress?.city
        const postal = val.donationAddress?.postalCode
        return (
            {
                id: index, 
                col1: name,
                col2: 0,
                col3: state,
                col4: city,
                col5: postal
            })

    })


    return (
        <div style={{ height: '1000px', width: '100%' }}>
            <DataGrid rows={rows} columns={cols}/>
        </div>
    )
}

export default Datagrids