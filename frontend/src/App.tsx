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

const CheckTokenButton: React.FC = () => {
  const { checkToken } = useBff();
  return (
    <button className='logout-button' onClick={checkToken}>
      Check Token
    </button>
  );
};

const CheckSessionButton: React.FC = () => {
  const { checkSession } = useBff();
  return (
    <button className='logout-button' onClick={checkSession}>
      Check Session
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
    <div className='card'>
      <CheckTokenButton />
    </div>
    <div className='card'>
      <CheckSessionButton />
    </div>
  </BffProvider>
);

export default App;
