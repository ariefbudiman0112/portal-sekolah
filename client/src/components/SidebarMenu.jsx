import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Nav, Button, Offcanvas } from "react-bootstrap";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../axios-client.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faUsers,
  faCog,
  faSignOutAlt,
  faBars,
} from "@fortawesome/free-solid-svg-icons";

const SidebarMenu = () => {
  const { setUser, setToken } = useStateContext();
  const [active, setActive] = useState("dashboard");
  const [show, setShow] = useState(false);

  const handleSelect = (eventKey) => {
    setActive(eventKey);
    setShow(false);
  };

  useEffect(() => {
    axiosClient.get("/user").then(({ data }) => {
      setUser(data);
    });
  }, []);

  const renderLinks = () => {
    return (
      <>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="dashboard"
            eventKey="dashboard"
            onClick={() => setShow(false)}
          >
            <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="users"
            eventKey="users"
            onClick={() => setShow(false)}
          >
            <FontAwesomeIcon icon={faUsers} /> Users
          </Nav.Link>
        </Nav.Item>
        {/* <Nav.Item>
          <Nav.Link eventKey="settings" onClick={() => setShow(false)}>
            <FontAwesomeIcon icon={faCog} /> Settings
          </Nav.Link>
        </Nav.Item> */}
      </>
    );
  };

  return (
    <>
      <div className="btn-menu">
        <Button variant="dark" onClick={() => setShow(true)}>
          <FontAwesomeIcon icon={faBars} />
        </Button>
      </div>

      <Offcanvas show={show} onHide={() => setShow(false)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Sidebar Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">{renderLinks()}</Nav>
        </Offcanvas.Body>
      </Offcanvas>
      <Nav
        className="d-none d-md-flex flex-column sidebar-menu"
        activeKey={active}
        onSelect={handleSelect}
      >
        {renderLinks()}
      </Nav>
    </>
  );
};

export default SidebarMenu;
