import { useEffect, useState, useRef } from "react";
import axiosClient from "../axios-client.js";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import { Table, Dropdown, DropdownButton } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faPlus } from "@fortawesome/free-solid-svg-icons";
import DataTable from "datatables.net-bs5";
import "datatables.net-responsive-bs5";
import "datatables.net-scroller-bs5";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, setNotification } = useStateContext();
  const tableRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (tableRef.current) {
      const table = new DataTable(tableRef.current, {
        fixedHeader: true, // Enable fixedHeader option
      });
      return () => table.destroy();
    }
  }, [users]);

  const onDeleteClick = (user) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    axiosClient.delete(`users/${user.id}`).then(() => {
      setNotification("User was successfully deleted");
      getUsers();
    });
  };

  const getUsers = () => {
    setLoading(true);
    axiosClient
      .get("/users")
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 20,
        }}
      >
        <h1>Data Users</h1>
        <Link className="btn-add" to="/users/new">
          <FontAwesomeIcon icon={faPlus} />
        </Link>
      </div>
      <div className="card-users animated fadeInDown table-responsive">
        <Table ref={tableRef} class="display">
          <thead className="thead-fixed">
            <tr>
              <th>No</th>
              <th>NISS</th>
              <th>Nama lengkap</th>
              <th>Email</th>
              <th>Created at</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          {loading && (
            <tbody>
              <tr>
                <td colSpan="5" class="text-center">
                  Loading...
                </td>
              </tr>
            </tbody>
          )}
          {!loading && (
            <tbody>
              {users.map((u, index) => (
                <tr key={u.id}>
                  <td>{index + 1}</td>
                  <td>{u.niss}</td>
                  <td>{u.namalengkap}</td>
                  <td>{u.email}</td>
                  <td>{u.created_at}</td>
                  <td>{u.is_active}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="light" id="dropdown-basic">
                        <FontAwesomeIcon icon={faEllipsisH} />
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item as={Link} to={"users/" + u.id}>
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item onClick={(ev) => onDeleteClick(u)}>
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </Table>
      </div>
    </div>
  );
}
