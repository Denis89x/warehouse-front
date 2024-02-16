import {Link} from "react-router-dom";

export const Header = () => {
    return (
        <header className={"header"}>
            <nav className={"navbar"}>
                <div className={"navbar-logo"}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path fill="currentColor"
                              d="M2 21V7l10-4l10 4v14h-6v-8H8v8zm7 0v-2h2v2zm2-3v-2h2v2zm2 3v-2h2v2z"></path>
                    </svg>
                </div>
                <div className={"header-entities"}>
                    <Link to={"/type"}>
                        Product type
                    </Link>
                    <Link to={"/product"}>
                        Product
                    </Link>
                    <Link to={"/supplier"}>
                        Supplier
                    </Link>
                    <Link to={"/store"}>
                        Store
                    </Link>
                    <Link to={"/order"}>
                        Order
                    </Link>
                </div>
            </nav>
        </header>
    );
};