import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectAuthState } from "../../store/Auth";

const requireAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const router = useRouter();
    const authState = useSelector(selectAuthState);

    const handleClick = (e) => {
      e.preventDefault();
      if (!authState?.user?.pk) {
        router.push("/login");
      } else {
        props.onClick();
      }
    };

    return <WrappedComponent {...props} onClick={handleClick} />;
  };

  return AuthenticatedComponent;
};

export default requireAuth;
