import { Outlet } from "react-router-dom"
import AuthNav from "../components/AuthNav"

const AuthLayout = () => {
    return (
        <div>
            <AuthNav/>
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default AuthLayout