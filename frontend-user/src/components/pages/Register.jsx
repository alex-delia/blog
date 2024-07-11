import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const Register = () => {
    const { isAuthenticated } = useContext(AuthContext);

    if (isAuthenticated) {
        return <Navigate to={'/'} replace />;
    }

    return (
        <div className="mt-5">
            <h2 className="text-2xl text-center font-bold underline2">Register</h2>
        </div>
    );
};

export default Register;