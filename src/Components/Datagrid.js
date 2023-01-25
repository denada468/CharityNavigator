import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
/*
Fields
Charity name
Category name
Address (Country, state, city, postal)
*/

function Datagrids() {
    const checkLocalStorage = false
    const apiId = "20472357"
    const apiKey = "11d6cc3af01966339329d5411fb30376"
    const apiLink = `https://api.data.charitynavigator.org/v2/Organizations?app_id=${apiId}&app_key=${apiKey}&pageSize=1000`
    const [dataPoint, setData] = useState([]);
    
    const getCharityData = async() => {
        var api
        var dataP 

        if (checkLocalStorage){
            const check = localStorage.getItem('data')

            if (check) {
                setData(JSON.parse(check))
            } else {
                api = await fetch(apiLink)
                dataP = await api.json()
                localStorage.setItem('data', JSON.stringify(dataP))
                setData(dataP)
            }
        }
        else {
            api = await fetch(apiLink)
            dataP = await api.json()
            setData(dataP)
        }
    }
    useEffect(() => {
        getCharityData()
    },[])

    console.log(dataPoint)
    // ein, 
    const cols = [
        {field: 'name', headerName: 'Charity Name', width: 500},
        {field: 'revenue', headerName: 'Total Revenue', width: 150},
        {field:'city', headerName: 'City', width: 150},
        {field:'state', headerName: "State", width: 150},
        {field:'postalcode', headerName: "Zip", width: 150},
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
        //const state = val.donationAddress?.stateOrProvince
        return val
        // if (checkState(state)) 
        // {
        //     return val
        // }
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
        const name = val?.charityName.toUpperCase()
        const ein = val?.ein
        const state = val.donationAddress?.stateOrProvince.toUpperCase()
        const city = val.donationAddress?.city.toUpperCase()
        const postal = val.donationAddress?.postalCode.toUpperCase()
        return (
            {
                id: index, 
                name: name,
                revenue: 0,
                state: state,
                city: city,
                postalcode: postal
            })

    })

    return (
        <div style={{ height: '1000px', width: '100%' }}>
            <DataGrid 
                rows={rows} columns={cols} 
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'name', sort: 'asc' }],
                    },
                }}
            />
        </div>
    )
}

export default Datagrids