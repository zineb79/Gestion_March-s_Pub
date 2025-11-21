import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { login } from "../services/AuthService";
import "./login.css";
import email_icon from "../components/images/icon/mail.png";
import password_icon from "../components/images/icon/password.png";
import logo from "../components/images/img4.png";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await login(email, password);

      if (authContext) {
        const refreshToken = localStorage.getItem("refreshToken");
        const role = localStorage.getItem("role");
        authContext.login(token, refreshToken || "", role || "");
      }

      const role = localStorage.getItem("role");

      if (role === "CHEF_DE_SERVICE") navigate("/accueil-chef");
      else if (role === "SECRETAIRE") navigate("/accueil-secretaire");
      else navigate("/unauthorized");
    } catch (error) {
      setErrorMessage("Email ou mot de passe invalide");

    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="left-bar">
          <p>Service de l'administration général</p>
        </div>
        <div className="right-section">
          <div className="logo-img">
            <img src={logo} alt="" />
          </div>
          <div className="header">
            <div className="text">Connexion</div>
            <div className="underligne"></div>
          </div>
          <form onSubmit={handleLogin} className="inputs">
            <div className="input">
              <img src={email_icon} alt="" />
              <TextField
                fullWidth
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: 'transparent',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'transparent',
                    },
                  },
                }}
              />
            </div>
            <div className="input">
              <img src={password_icon} alt="" />
              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                placeholder="Mot de Passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        sx={{ 
                          padding: '8px',
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)'
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: 'transparent',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'transparent',
                    },
                  },
                }}
              />
            </div>
            {errorMessage && (
              <div style={{ color: "red", textAlign: "center" }}>
                {errorMessage}
              </div>
            )}
            <div className="btn">
              <button type="submit" className="btn btn-primary btn-lg">
                Se connecter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;