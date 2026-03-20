import AppBarHeader from "../atoms/AppBarHeader";
import UserMenu from "../molecules/UserMenu";
import TokenExpiryBanner from "../../shared/TokenExpiryBanner";

const AppNavbar = ({
  loggedUser, onHomeClick, onLogout,
  showWarning, secondsLeft, onStayLoggedIn,
}) => {
  return (
    <>
      <AppBarHeader
        title="Contact Application"
        onHomeClick={onHomeClick}
        rightSlot={
          <UserMenu
            loggedUser={loggedUser}
            onLogout={onLogout}
          />
        }
      />
      {showWarning && (
        <TokenExpiryBanner
          secondsLeft={secondsLeft}
          onStayLoggedIn={onStayLoggedIn}
        />
      )}
    </>
  );
};

export default AppNavbar;