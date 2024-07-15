import { Link } from "react-router-dom";
import Button from '../common/Button.jsx';
import list from '/list.svg';
import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext.jsx";

const NavBar = () => {
    const [isOpen, setOpen] = useState(false);

    const { logout, user } = useContext(AuthContext);

    return (
        <nav className="flex justify-between items-center gap-5 py-4 border-b-2 border-gray-300">
            <ul className="hidden md:flex md:gap-5 text-nowrap">
                <li className="text-xl hover:underline">
                    <Link to='/posts'>My Posts</Link>
                </li>
                <li className="text-xl hover:underline">
                    <Link to='/posts/new'>New Post</Link>
                </li>
            </ul>

            <h1 className="text-3xl font-bold text-center">
                <Link to='/'>Author Dashboard</Link>
            </h1>

            <div className="hidden md:flex md:gap-3 text-nowrap items-center">
                <span>Welcome {user.firstName}</span>
                <Button text='Sign Out' onClick={logout} />
            </div>

            <div className="relative md:hidden">
                <button className="p-1 border-2 border-black rounded hover:bg-gray-300"
                    onClick={() => setOpen(!isOpen)}>
                    <img src={list} alt="menu" className="h-5" />
                </button>
                {isOpen && (
                    <div className="absolute right-0 mt-2 w-28 bg-white divide-y divide-gray-100 rounded-lg shadow-lg">
                        <Link
                            to="/about"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setOpen(!isOpen)}
                        >
                            About
                        </Link>
                        <Link
                            to="/authors"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setOpen(!isOpen)}
                        >
                            Authors
                        </Link>
                        <Link
                            to="/posts"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setOpen(!isOpen)}
                        >
                            Posts
                        </Link>

                        <div
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:cursor-pointer"
                            onClick={() => {
                                logout();
                                setOpen(!isOpen);
                            }}
                        >
                            Sign Out
                        </div>

                    </div>
                )}
            </div>
        </nav >
    );
};

export default NavBar;