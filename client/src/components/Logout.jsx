import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        axios.post('http://localhost:4000/logout')
            .then((response) => {
                console.log(response.data.message);
                navigate('/login'); // Redirect to the login page after logging out
            })
            .catch((error) => {
                console.error('Error logging out:', error);
            });
    };

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
}

export default LogoutButton;
