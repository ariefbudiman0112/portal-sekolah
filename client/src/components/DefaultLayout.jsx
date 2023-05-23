import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../axios-client.js";
import { useEffect, useState } from "react";
import {
  Nav,
  Navbar,
  NavDropdown,
  Container,
  SplitButton,
  Breadcrumb,
  Row,
  Col,
} from "react-bootstrap";
import SidebarMenu from "./SidebarMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DefaultLayout() {
  const { user, token, notification, setUser, setToken, setNotification } =
    useStateContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  //Check available token
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      //get user data
      axiosClient.get("/user").then(({ data }) => {
        setUser(data);
      });
    }
  }, []);

  //Auto logout within timelimit
  const [timeoutId, setTimeoutId] = useState(true);

  const resetTimer = () => {
    clearTimeout(timeoutId);
  };

  const handleLogout = () => {
    console.log("Logging out user...");
    // Call logout endpoint to remove user's session
    // toast.error("You need to log in to access this page.", {
    //   position: toast.POSITION.TOP_CENTER,
    // });
    toast.error("Logging out user....", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
    axiosClient
      .post("/logout")
      .then(() => {
        // Reset token and redirect to login page
        setToken(null);
        // navigate("/login");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    // Check user's last activity when the component is mounted
    console.log("NISS ", user.niss);
    axiosClient
      .post("/check-activity", {
        niss: user.niss,
      })
      .then((response) => {
        const lastActivity = response.data;
        const lastActivityDate = Date.parse(lastActivity);
        const now = new Date();
        const diff = now - 2 * 60 * 60 * 1000 - lastActivityDate;
        const timeout = 30 * 60 * 1000; // 5 minutes
        console.log("Time now ", now - 2 * 60 * 60 * 1000);
        console.log("Last activity ", lastActivityDate);
        console.log(diff);
        if (diff < timeout) {
          // User's last activity is still within the time limit
          // Update user's last activity
          axiosClient
            .post("/update-activity", {
              niss: user.niss,
            })
            .then(() => {
              console.log("User activity updated");
            })
            .catch((error) => {
              console.log(error);
            });

          // Start timer to track user's activity
          const timeid = setTimeout(() => {
            axiosClient
              .post("/check-activity", {
                niss: user.niss,
              })
              .then(() => {
                console.log("User activity tracked");
              })
              .catch((error) => {
                console.log(error);
              });
          }, timeout);
          setTimeoutId(timeid);

          // Add event listener to reset timer when user interacts with the page
          window.addEventListener("click", resetTimer);
          window.addEventListener("mousemove", resetTimer);
          window.addEventListener("mousedown", resetTimer);
          window.addEventListener("keypress", resetTimer);
          window.addEventListener("beforeunload", handleLogout);
        } else {
          // User's last activity is beyond the time limit, so log them out
          handleLogout();
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("mousedown", resetTimer);
      window.removeEventListener("keypress", resetTimer);
      window.removeEventListener("beforeunload", handleLogout);
    };
  }, [
    user.niss,
    history,
    setToken,
    resetTimer,
    setTimeoutId,
    handleLogout,
    axiosClient,
  ]);

  //logout function
  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post("/logout").then(() => {
      setUser({});
      setToken(null);
      // navigate("/login");
      window.location.reload();
    });
  };

  return (
    <>
      <div>
        <ToastContainer />
        <Navbar bg="light" fixed="top">
          <Container fluid>
            <Navbar.Brand href="/dashboard">Portal sekolah</Navbar.Brand>
            <Nav className="ml-auto">
              <NavDropdown
                title={user.namalengkap}
                align="end"
                id="dropdown-menu-align-end"
              >
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item eventKey="logout" onClick={onLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Container>
        </Navbar>
        <Container fluid>
          <Row>
            <Col md={2} lg={2} className="d-md-block">
              <SidebarMenu />
            </Col>
            <Col md={10} lg={10} className="px-4">
              <Breadcrumb>
                {location.pathname.split("/").map((path, index, arr) => {
                  const fullPath = `${arr.slice(0, index + 1).join("/")}`;
                  return (
                    <Breadcrumb.Item
                      key={index}
                      href={fullPath === "" ? "/" : fullPath}
                    >
                      {path === "" ? "Home" : path}
                    </Breadcrumb.Item>
                  );
                })}
              </Breadcrumb>
              <Outlet />
            </Col>
          </Row>
          {notification && <div className="notification">{notification}</div>}
        </Container>
      </div>
    </>
  );
}
