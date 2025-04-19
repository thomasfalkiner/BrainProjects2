import React, { useState } from "react"
import axios from 'axios'
import {Formik, Form, Field, ErrorMessage} from "formik"

function Search() {
    const [text, setText] = useState('')
    const initialValue = {
        subjectId:"1",
        location:"B"
    };

    const onSubmit = async (data, { setSubmit} ) => {
        try {
            const res = await axios.get('http://localhost:3001/sessions/', {
                params: { 
                    subjectId: data.subjectId,
                    location: data.location
                }
            })
            setText(JSON.stringify(res.data, null, 2))
        }
        catch (err) {
            console.error(err)
        }
        finally {
            setSubmit(false)
        }
    };

    return (
        <div className="searchDatabasePage">
            <Formik initialValues={initialValue} onSubmit={onSubmit}>
                <Form>
                    <label>Subject ID</label>
                    <Field id="subjectId" name = "subjectId" type="text"/>
                    <ErrorMessage name="subjectid" component="div" className="error"/>
                    <button type="submit">Search</button>
                </Form>
            </Formik>
            <div>Results: {text} </div>
        </div>
    );

}
export default Search