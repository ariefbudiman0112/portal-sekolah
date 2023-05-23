import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function UserForm() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [user, setUser] = useState({
    id: null,
    niss: "",
    namalengkap: "",
    email: "",
    password: "",
    password_confirmation: "",
    is_active: "",
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token, setNotification } = useStateContext();

  if (id) {
    useEffect(() => {
      setLoading(true);
      axiosClient
        .get(`users/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setUser(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }, []);
  }

  const onSubmit = (ev) => {
    ev.preventDefault();
    if (user.id) {
      axiosClient
        .put(`users/${user.id}`, user)
        .then(() => {
          setNotification("User was successfully updated");
          navigate("users");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post("/users", user)
        .then(() => {
          setNotification("User was successfully created");
          navigate("users");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  return (
    <>
      {user.id && <h1>Update User: {user.namalengkap}</h1>}
      {!user.id && <h1>New User</h1>}
      <div className="card animated fadeInDown">
        {loading && <div className="text-center">Loading...</div>}
        {/* {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )} */}
        {!loading && (
          <div className="card-users animated fadeInDown">
            <form onSubmit={onSubmit}>
              <input
                readOnly
                value={user.niss}
                onChange={(ev) => setUser({ ...user, niss: ev.target.value })}
                placeholder="niss"
                className={`form-control ${
                  errors && errors.niss ? "is-invalid" : ""
                }`}
              />
              <br />
              <input
                value={user.namalengkap}
                onChange={(ev) =>
                  setUser({ ...user, namalengkap: ev.target.value })
                }
                placeholder="Nama lengkap"
                className={`form-control ${
                  errors && errors.namalengkap ? "is-invalid" : ""
                }`}
              />
              {errors && errors.namalengkap && (
                <div className="invalid-feedback">{errors.namalengkap[0]}</div>
              )}
              <br />
              <input
                value={user.email}
                onChange={(ev) => setUser({ ...user, email: ev.target.value })}
                placeholder="Email"
                className={`form-control ${
                  errors && errors.email ? "is-invalid" : ""
                }`}
              />
              {errors && errors.email && (
                <div className="invalid-feedback">{errors.email[0]}</div>
              )}
              <br />
              <div>
                <p>Status:</p>
                <label>
                  <input
                    type="radio"
                    value="1"
                    checked={user.is_active === "1"}
                    onChange={(ev) =>
                      setUser({ ...user, is_active: ev.target.value })
                    }
                  />{" "}
                  Active
                </label>
                &nbsp;
                <label>
                  <input
                    type="radio"
                    value="0"
                    checked={user.is_active === "0"}
                    onChange={(ev) =>
                      setUser({ ...user, is_active: ev.target.value })
                    }
                  />{" "}
                  Deactive
                </label>
              </div>
              {errors && errors.is_active && (
                <div className="invalid-feedback">{errors.is_active[0]}</div>
              )}
              <br />
              <input
                type="password"
                onChange={(ev) =>
                  setUser({ ...user, password: ev.target.value })
                }
                placeholder="Password"
                className={`form-control ${
                  errors && errors.password ? "is-invalid" : ""
                }`}
              />
              {errors && errors.password && (
                <div className="invalid-feedback">{errors.password[0]}</div>
              )}
              <br />
              <input
                type="password"
                onChange={(ev) =>
                  setUser({ ...user, password_confirmation: ev.target.value })
                }
                placeholder="Password Confirmation"
                className={`form-control ${
                  errors && errors.password_confirmation ? "is-invalid" : ""
                }`}
              />
              {errors && errors.password_confirmation && (
                <div className="invalid-feedback">
                  {errors.password_confirmation[0]}
                </div>
              )}
              <br />
              <button className="btn btn-primary btn-block">Save</button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
