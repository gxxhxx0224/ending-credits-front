import { RouteObject } from "react-router-dom";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import InfoPage from "../pages/ProfilePage/InfoPage/InfoPage";
import PrivacyPolicyPage from "../pages/ProfilePage/PrivacyPolicyPage/PrivacyPolicyPage";
import TermsOfUsePage from "../pages/ProfilePage/TermsOfUsePage/TermsOfUsePage";
import AddressPage from "../pages/ProfilePage/InfoPage/AddressPage/AddressPage";

const ProfileRoutes: RouteObject[] = [
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/profile/info",
    element: <InfoPage />,
  },
  {
    path: "/profile/privacy-policy",
    element: <PrivacyPolicyPage />,
  },
  {
    path: "/profile/terms-of-use",
    element: <TermsOfUsePage />,
  },
  {
    path: "/profile/address",
    element: <AddressPage />,
  },
];

export default ProfileRoutes;
