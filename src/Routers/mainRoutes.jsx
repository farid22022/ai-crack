import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import Error from "../pages/Error";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateRoute from "./PrivateRoute";
import Generate from "../components/Generate";
import PaintingDetails from "../pages/PaintingDetails";
import Paintings from "../pages/Paintings";
import Upscale from "../components/Upscale";
import UpScaledImageCollection from "../pages/UpScaledImageCollection";
import Uncrop from "../components/Uncrop";
import UncroppedImages from "../pages/UncroppedImages";
import RemoveBg from "../components/RemoveBg";
import RemovingText from "../components/RemovingText";

const mainRoutes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    errorElement: <Error></Error>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "login",
        element: <Login></Login>,
      },
      {
        path: "paintings",
        element: <Paintings></Paintings>,
        loader: () => fetch("https://ai-photo-crack.vercel.app/paintings")
      },
      {
        path: "upscaledImages",
        element: <UpScaledImageCollection></UpScaledImageCollection>,
        loader: () => fetch("https://ai-photo-crack.vercel.app/upscaling/upget")
      },
      {
        path: "uncroppedImages",
        element: <UncroppedImages></UncroppedImages>,
        loader: () => fetch("https://ai-photo-crack.vercel.app/uncropping/uncropget")
      },
      {
        path: "removeText",
        element: <RemovingText></RemovingText>,
        loader: () => fetch("https://ai-photo-crack.vercel.app/uncropping/uncropget")
      },
      {
        path: "upscaling",
        element: (
          <PrivateRoute>
            <Upscale></Upscale>
          </PrivateRoute>
        ),
        loader: () => fetch("https://ai-photo-crack.vercel.app/uncropping/uncropget")
      },
      {
        path: "uncrop",
        element: (
          <PrivateRoute>
            <Uncrop></Uncrop>
          </PrivateRoute>
        ),
      },
      {
        path: "bgremoving",
        element: (
          <PrivateRoute>
            <RemoveBg></RemoveBg>
          </PrivateRoute>
        ),
      },
      {
        path: "generate",
        element: (
          <PrivateRoute>
            <Generate></Generate>
          </PrivateRoute>
        ),
      },
      {
        path: "/paintings/:id",
        element: (
          <PrivateRoute>
            <PaintingDetails/>
          </PrivateRoute>
        ),
        loader: ({ params }) => fetch(`https://ai-photo-crack.vercel.app/paintings/${params.id}`)
      },
      {
        path: "registration",
        element: <Register></Register>,
      },
      {},
    ],
  },
]);

export default mainRoutes;
