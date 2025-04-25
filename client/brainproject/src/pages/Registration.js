import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "../css/Registration.css"

function Registration() {
  const initialValues = {
    username: "",
    password: "",
  };
  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(15).required(),
    password: Yup.string().min(4).max(20).required(),
  });

  const onSubmit = (data) => {
    axios.post("http://localhost:3001/users/register", data, {
      headers: {
        accessToken: sessionStorage.getItem("accessToken"),
      },
    })
    .then((response) => {
      if (response.data.message === "User created") {
        alert("✅ Created User");
      } else if (response.data.message === "User already exists") {
        alert("⚠️ User already exists");
      } else if (response.data.message === "Unauthorized") {
        alert("🚫 You are not an admin and cannot create new users");
      } else {
        alert("Something unexpected happened.");
      }
    })
    .catch((error) => {
      console.error("Registration error:", error);
      alert("Error registering user.");
    });
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >

        <Form className="register">
        <label>This page is for Admin users to create new users.</label>
          <label>Username: </label>
          <ErrorMessage name="username" component="span" />
          <Field
            id="registerUsername"
            name="username"
          />

          <label>Password: </label>
          <ErrorMessage name="password" component="span" />
          <Field
            type="password"
            id="registerPassword"
            name="password"
          />

          <button type="submit"> Register</button>
        </Form>
      </Formik>
    </div>
  );
}

export default Registration;