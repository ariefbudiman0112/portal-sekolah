import { useEffect, useState, useRef } from "react";
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import { Table } from "react-bootstrap";
import DataTable from "datatables.net-bs5";
import "datatables.net-responsive-bs5";
import "datatables.net-scroller-bs5";

export default function Data() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const tableRef = useRef(null);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (tableRef.current) {
      const table = new DataTable(tableRef.current, {
        fixedHeader: true, // Enable fixedHeader option
      });
      return () => table.destroy();
    }
  }, [data]);

  const onDeleteClick = (data) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    axiosClient.delete(`/users/${data.id}`).then(() => {
      setNotification("User was successfully deleted");
      getData();
    });
  };

  const getData = () => {
    setLoading(true);
    axiosClient
      .get("/users")
      .then(({ data }) => {
        setLoading(false);
        setData(data.data);
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
          Add new
        </Link>
      </div>
      <div className="table-wrapper card animated fadeInDown table-responsive">
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
              {data.map((u, index) => (
                <tr key={u.id}>
                  <td>{index + 1}</td>
                  <td>{u.niss}</td>
                  <td>{u.namalengkap}</td>
                  <td>{u.email}</td>
                  <td>{u.created_at}</td>
                  <td>{u.is_active}</td>
                  <td>
                    <Link className="btn-edit" to={"/users/" + u.id}>
                      Edit
                    </Link>
                    &nbsp;
                    <button
                      className="btn-delete"
                      onClick={(ev) => onDeleteClick(u)}
                    >
                      Delete
                    </button>
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
