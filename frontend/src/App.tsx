import { useState } from "react";
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

const FetchAPIButton: React.FC = () => {
  const { fetchBff } = useBff();
  const [data, setData] = useState();

  const fetchAPI = async (path: string): Promise<void> => {
    const response = await fetchBff(path);

    if (response.ok) {
      // If the session is valid, update the user state with the received claims data
      setData(await response.json());
    } else {
      console.error("Unexpected response from checking session:", response);
    }
  };

  return (
    <>
      <div>{data ? `${data}` : "...loading Data..."}</div>
      <button
        className='logout-button'
        onClick={() => fetchAPI("api/getWeather")}
      >
        Fetch API
      </button>
    </>
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
    <FetchAPIButton />
  </BffProvider>
);

export default App;
