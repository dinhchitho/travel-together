import { useEffect, useRef } from "react";
import "./Header.scss";
import { useSelector } from "react-redux";
import Notifications from "../Notifications/Notifications";

const clickOutsideRef = (content_ref: any, toggle_ref: any) => {
  document.addEventListener("mousedown", (e) => {
    // user click toggle
    if (toggle_ref.current && toggle_ref.current.contains(e.target)) {
      content_ref.current.classList.toggle("active");
    } else {
      // user click outside toggle and content
      if (content_ref.current && !content_ref.current.contains(e.target)) {
        content_ref.current.classList.remove("active");
      }
    }
  });
};

const Header = () => {
  const dropdown_toggle_el = useRef(null);
  const dropdown_content_el = useRef(null);

  const notifications: any = useSelector(
    (state: any) => state.app.notifications
  );

  useEffect(() => {
    clickOutsideRef(dropdown_content_el, dropdown_toggle_el);
  }, []);

  return (
    <header>
      <div className="container-header">
        <div className="container-header-right">
          <div className="container-user">
            <i className="bx bxs-user-circle header-icon"></i>
            <span>Admin</span>
          </div>
          <div className="container-notification">
            <button
              ref={dropdown_toggle_el}
              className="container-notification-toggle"
            >
              <i className="bx bx-bell header-icon"></i>
              <span className="container-notification-toggle-badge">
                {notifications.length}
              </span>
            </button>
            <div
              ref={dropdown_content_el}
              className="container-notification-content"
            >
              <Notifications />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
