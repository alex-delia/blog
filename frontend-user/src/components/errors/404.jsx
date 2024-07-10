import { useLocation } from "react-router-dom";

export default function ErrorPage() {
    const location = useLocation();

    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, the page at {location.pathname} does not exist.</p>
        </div>
    );
}