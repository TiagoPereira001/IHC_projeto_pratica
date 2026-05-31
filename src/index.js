import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { ClerkProvider } from "@clerk/clerk-react";
import { ptPT } from "@clerk/localizations";

const PUBLISHABLE_KEY = "pk_test_YnJpZ2h0LWNpY2FkYS0yNi5jbGVyay5hY2NvdW50cy5kZXYk";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} localization={ptPT}>
    <App />
  </ClerkProvider>
);


