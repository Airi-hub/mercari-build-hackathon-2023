import { FaHome, FaCamera, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const Footer: React.FC = () => {
  const [cookies] = useCookies(["userID", "token"]);
  const navigate = useNavigate();

  if (!cookies.token) {
    return <></>;
  }
  return (
    <footer className="w-full p-px grid grid-flow-col justify-stretch gap-px bg-white">
      <div className="footer-item" onClick={() => navigate("/")}>
        <FaHome />
        <p>Home</p>
      </div>
      <div className="footer-item" onClick={() => navigate("/sell")}>
        <FaCamera />
        <p>Listing</p>
      </div>
      <div
        className="footer-item"
        onClick={() => navigate(`/user/${cookies.userID}`)}
      >
        <FaUser />
        <p>MyPage</p>
      </div>
    </footer>
  );
};
