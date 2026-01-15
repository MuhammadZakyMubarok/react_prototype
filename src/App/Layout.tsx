import React from "react"
//import Navbar from '../Component/navbar.tsx'

type Props = {
    children: React.ReactNode
}

function Layout(props: Props){
    return (
        <>
            {/* <Navbar /> */}
            <main>
                {props.children}
            </main>
        </>
    )

}

export default Layout