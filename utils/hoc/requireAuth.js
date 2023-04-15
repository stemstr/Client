import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Route } from "../../enums/routes";
import { selectAuthState } from "../../store/Auth";

const requireAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const router = useRouter();
    const authState = useSelector(selectAuthState);

    const handleClick = (e) => {
      e.preventDefault();
      if (!authState?.user?.pk) {
        router.push(Route.Login);
      } else {
        props.onClick();
      }
    };

    return <WrappedComponent {...props} onClick={handleClick} />;
  };

  return AuthenticatedComponent;
};

export default requireAuth;
