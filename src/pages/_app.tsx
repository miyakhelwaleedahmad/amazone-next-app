import RootLayout from "../components/RootLayout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Provider } from "react-redux";
import { store, persistor } from "../store/store";
import { PersistGate } from "redux-persist/integration/react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast"; // ✅ import Toaster

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <SessionProvider session={(pageProps as any).session}>
            <div className="font-bodyFont bg-[#E3E6E6]">
              <RootLayout>
                <Component {...pageProps} />
              </RootLayout>
            </div>
          </SessionProvider>
        </PersistGate>
      </Provider>

      {/* ✅ Toaster outside providers */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            zIndex: 9999, // make sure it is visible on top of everything
            background: "#000",
            color: "#fff",
            borderRadius: "8px",
            padding: "12px 16px",
          },
        }}
      />
    </>
  );
}
