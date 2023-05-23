import { Link } from "react-router-dom";
import axiosClient from "../axios-client.js";
import { createRef, useState } from "react";
import { useStateContext } from "../context/ContextProvider.jsx";
import {
  Button,
  Form,
  FormGroup,
  FormControl,
  FormLabel,
  Alert,
} from "react-bootstrap";

export default function Login() {
  const nissRef = createRef();
  const passwordRef = createRef();
  const rememberMeRef = createRef();
  const { setUser, setToken } = useStateContext();
  const [errors, setErrors] = useState(null);
  const [message, setMessage] = useState(null);

  const onSubmit = (ev) => {
    ev.preventDefault();

    const payload = {
      niss: nissRef.current.value,
      password: passwordRef.current.value,
      remember_me: rememberMeRef.current.checked,
    };
    axiosClient
      .post("/login", payload)
      .then(({ data }) => {
        setUser(data.data);
        setToken(data.token);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.data.message) {
          setMessage(response.data.message);
        } else if (response && response.data.errors) {
          setErrors(response.data.errors);
        }
      });
  };

  return (
    <div>
      <div className="login-signup-form animated fadeInDown">
        <Form className="form" onSubmit={onSubmit}>
          <h1 className="title">Login into your account</h1>

          {message && (
            <Alert variant="danger">
              <p>{message}</p>
            </Alert>
          )}

          <FormGroup>
            <FormLabel>NISS</FormLabel>
            <FormControl type="number" placeholder="Enter niss" ref={nissRef} />
          </FormGroup>
          <br />
          <FormGroup>
            <FormLabel>Password</FormLabel>
            <FormControl
              type="password"
              placeholder="Enter password"
              ref={passwordRef}
            />
          </FormGroup>
          <br />
          <FormGroup>
            <label>
              Remember me ?
              <input
                ref={rememberMeRef}
                type="checkbox"
                className="custom-checkbox"
              />
            </label>
          </FormGroup>
          <br />
          <Button variant="primary" type="submit" className="button-login">
            Login
          </Button>

          <p className="message">
            <Link to="/forgot-password">Forgot password?</Link>
          </p>

          {/* <p className="message">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p> */}
        </Form>
      </div>
    </div>
  );
}
