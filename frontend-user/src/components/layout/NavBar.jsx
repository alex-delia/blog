import { Link } from "react-router-dom";
import Button from '../common/Button.jsx';
import list from '/list.svg';
import { useState } from "react";

const NavBar = () => {
    const [isOpen, setOpen] = useState(false);

    return (
        <nav className="flex justify-between items-center py-4 border-b-2 border-gray-300">
            <ul className="hidden md:flex md:gap-5 md:basis-0 md:grow text-nowrap">
                <li className="text-xl hover:underline">
                    <Link to='/about'>About</Link>
                </li>
                <li className="text-xl hover:underline">
                    <Link to='/authors'>Authors</Link>
                </li>
                <li className="text-xl hover:underline">
                    <Link to='/posts'>All Posts</Link>
                </li>
            </ul>

            <h1 className="text-3xl font-bold">
                <Link to='/'>Blog </Link>
            </h1>


            <div className="hidden md:flex md:gap-3 md:basis-0 md:grow md:justify-end">
                <Link to='/login'>
                    <Button text='Login' />
                </Link>
                <Link to='/register'>
                    <Button text='Register' bgColor='bg-zinc-800' hoverColor="hover:bg-zinc-700" />
                </Link>
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
                        <Link
                            to="/login"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setOpen(!isOpen)}
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setOpen(!isOpen)}
                        >
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;