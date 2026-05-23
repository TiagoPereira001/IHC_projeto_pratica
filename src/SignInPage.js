import { SignIn } from "@clerk/clerk-react";
import SmartphoneFrame from "./components/SmartphoneFrame";

function SignInPage() {
  return (
    <SmartphoneFrame>
      <SignIn
        routing="path"
        path="/sign-in"
        afterSignInUrl="/"
        appearance={{
          elements: {
            rootBox: {
              width: "360px",
              height: "100%",
            },
            card: {
              width: "360px",
              maxWidth: "360px",
              height: "100%",
              boxShadow: "none",
              borderRadius: "0px",
            },
          },
        }}
      />
    </SmartphoneFrame>
  );
}

export default SignInPage;