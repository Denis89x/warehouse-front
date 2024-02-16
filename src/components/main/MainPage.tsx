import './MainPage.css'
import {ReactElement, useState} from "react";
import FetchProductType from "../product-type/FetchProductType";

type ComponentType = 'home' | 'productType' | 'product' | 'supplier' | 'store' | 'order';

const MainPage = () => {
    const [activeComponent, setActiveComponent] = useState<ComponentType>('productType');

    const handleNavLinkClick = (component: ComponentType): void => {
        setActiveComponent(component);
    };

    const renderComponent = (): ReactElement | null => {
        switch (activeComponent) {
            case 'home':
                return <div>Home Component</div>;
            case 'productType':
                return <FetchProductType />;
            default:
                return null;
        }
    };

    return (
        <div className={"main-page"}>
            <header className={"header"}>
                <nav className={"navbar"}>
                    <div className={"navbar-logo"}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                            <path fill="currentColor"
                                  d="M2 21V7l10-4l10 4v14h-6v-8H8v8zm7 0v-2h2v2zm2-3v-2h2v2zm2 3v-2h2v2z"></path>
                        </svg>
                    </div>
                    <div className={"header-entities"}>
                        <button onClick={() => handleNavLinkClick('home')}>Home</button>
                        <button onClick={() => handleNavLinkClick('productType')}>Product type</button>
                    </div>
                </nav>
                <form action="" className="search-bar">
                    <input type="text" placeholder="Search..."/>
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                            <path fill="currentColor"
                                  d="m19.485 20.154l-6.262-6.262q-.75.639-1.725.989q-.975.35-1.96.35q-2.402 0-4.066-1.663q-1.664-1.664-1.664-4.065T5.47 5.436q1.663-1.667 4.064-1.667q2.402 0 4.068 1.664q1.666 1.664 1.666 4.067q0 1.042-.369 2.017q-.37.975-.97 1.668l6.262 6.261zM9.538 14.23q1.99 0 3.361-1.37q1.37-1.37 1.37-3.361q0-1.99-1.37-3.36q-1.37-1.37-3.36-1.37q-1.99 0-3.361 1.37q-1.37 1.37-1.37 3.36q0 1.99 1.37 3.36q1.37 1.37 3.36 1.37"></path>
                        </svg>
                    </button>
                </form>
            </header>
            <div className={"table-div"}>
                {renderComponent()}
            </div>
        </div>
    );
};

export default MainPage;