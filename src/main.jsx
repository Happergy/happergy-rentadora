import "./index.css";

import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import { SWRConfig } from "swr";
import { worker } from "./mocks/browser";

if (process.env.NODE_ENV === "development") {
  worker.start();
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 3000,
        revalidateOnMount: true,
      }}
    >
      <App />
    </SWRConfig>
  </React.StrictMode>
);
