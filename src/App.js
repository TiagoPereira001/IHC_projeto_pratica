import {
  SignedIn,
  SignedOut,
  UserButton,
  useUser
} from "@clerk/clerk-react";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import SignInPage from "./SignInPage";
import SmartphoneFrame from "./components/SmartphoneFrame";
import { Link } from "react-router-dom";
import WebserviceTestForm from "./WebserviceTest";
import AppScreens from "./AppScreens";
 // este vai ser o primeiro ecra a ser mostrado
function WelcomeScreen (){
  return (
    <div style = {{
      height: "100%",
      background: "#4a5e38",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      padding: "24px",
      fontFamily: "'Georgia', serif",
    }}>
      { /* aquio é o logo*/}
      <div style= {{ 
        textAlign: "center", 
        marginBottom: "16px"
        }}>
        <div style = {{
          fontSize: "26px", 
          color: "#fff", 
          letterSpacing:"1px"
          }}>
          Generative<span style ={{ 
            fontWeight: "900"
            }} >Jazz</span>
        </div>
        <div style = {{
          fontSize: "14px", 
          color: "#c8d8b0", 
          marginTop: "4px"
          }}>
          Boas-vindas.
        </div>
      </div>

      {/*vai ser o subtitulo*/}
      <p style = {{
        color:"#c8d8b0",
        fontSize: "20px",
        textAlign:"center"
      }}>
        Antes de continuar, tem que fazer login
      </p>

      { /* botao de entrar*/}

      <Link to ="/sign-in" style = {{
        display: "block",
        width: "100%",
        padding: "12px",
        background:"#2e3d1f",
        color:"#FFF",
        borderRadius:"8px",
        textAlign:"center",
        textDecoration:"none",
        fontWeight:"bold",
        fontSize:"16px",
        marginTop:"8px",
      }}>
        entrar
      </Link>
    </div>
  );
}

function Home() {
  return (
    <SmartphoneFrame>
      <SignedOut>
        <WelcomeScreen />
      </SignedOut>

      <SignedIn>
        <WebserviceTestForm/>
      </SignedIn>
    </SmartphoneFrame>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;