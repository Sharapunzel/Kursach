import { BffProvider, useBff } from "./components/Bff";
import { UserClaims } from "./components/UserClaims";

const LogoutButton: React.FC = () => {
  const { logout } = useBff();
  return (
    <button className='logout-button' onClick={logout}>
      Logout
    </button>
  );
};

const App: React.FC = () => (
  <BffProvider baseUrl='http://localhost:8001/BFF'>
    <div className='card'>
      <UserClaims />
    </div>
    <div className='card'>
      <LogoutButton />
    </div>
  </BffProvider>
);

export default App;
