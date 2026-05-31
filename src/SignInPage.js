

import { SignIn } from "@clerk/clerk-react";
import SmartphoneFrame from "./components/SmartphoneFrame";
function SignInPage() {
  return (
    <SmartphoneFrame>
      <div style = {{
        height: "100%",
        width: "100%",
        background:"#4a5e38",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Georgia', serif",
        padding :"12px",
        boxSizing: "border-box",
        overflow:"hidden",
      }}>
        {/* logo acima do formulario */}
        <div style = {{
          textAlign: "center",
          marginBottom: "24px"
        }}>
        <div style = {{
          fontSize: "24px",
          color: "#fff"
        }}>
          Generative 
        <span style= {{
          fontWeight: "900"
        }}> Jazz</span>
        </div>
        <div style={{
          fontSize: "14px",
          color: "#c8d8b0",
          marginTop: "4px"
        }}>
          Boas vindas.
        </div>
      </div>  

      {/* aquii vai o formulario com as cores do figma que temos*/}
    <div style = {{
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}>
      <SignIn
        routing="path"
        path="/sign-in"
        afterSignInUrl="/"
        appearance={{
          variables: {
            colorPrimary: "#2e3d1f",
            colorBackground: "#3f5230",
            colorText: "#fff",
            colorTextSecondary: "#c8d8b0",
            colorInputBackground: "#4a5e38",
            colorInputText: "#Fff",
            borderRadius: "8px",
          },
          elements: {
            rootBox: {
              width: "100%",
              display: "flex",
              justifyContent: "center",
              margin: "0",
            },
            card: {
              width: "100%",
              maxWidth: "100%",
              boxShadow: "none",
              borderRadius: "12px",
              border: "1px solid #5a7040",
              padding: "20px 16px",
              margin: "0",
            },

            headerTitle : { 
              color: "#fff",
              textAlign: "center"
            },
            headerSubtitle : {
              color: "#c8d8b0",
              textAlign: "center"
            },
            formButtonPrimary: {
              background: "#2e3d1f",
              fontFamily: "'Georgia', serif",
              width: "100%"
            },
            footerAction:{
              display:"flex",
              justifyContent: "center",
              alignItems: "center",
              padding:"16px 0",
              width:"100%",
            },
            footerActionText: {
              paddingRight:"4px"
            },
            footerActionLink: {
              color: "#8aab6a"
            },
            identifyPreviewText: {
              color:"#fff"
            },
            formFieldLabel: {
              color:"#c8d8b0"
            },
            // Centrar o "Secured by Clerk" e o banner de "Development Mode"
            internal: {
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            },
            footer: {
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }
            },
          }}
        />
        </div>
      </div>
    </SmartphoneFrame>
  );
}

export default SignInPage;