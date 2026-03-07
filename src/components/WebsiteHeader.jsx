import NavBar from './NavBar';  
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

function WebsiteHeader({loggedIn}) {
    return (
        <header className="header">
            <div className='websiteHeader'>
                <SportsEsportsIcon sx={{fontSize:60}}/>
                <h1 className="title">Game Store</h1>
            </div>
            <NavBar loggedIn={loggedIn}/>
        </header>
    );
}

export default WebsiteHeader;