import React, { useState } from "react"
import axios from 'axios'
import {Formik, Form, Field, ErrorMessage} from "formik"
import * as Yup from 'yup'

function Search() {
    const [text, setText] = useState('')
    const initialValue = {
        subjectId:"",
        location:""
    };

    const validationSchema = Yup.object().shape({
        subjectId: Yup.number().integer('Must be an integer'),
        location: Yup.string().min(1).max(1)
    })
    const onSubmit = async (data, { setSubmit} ) => {
        try {
            const res = await axios.get('http://localhost:3001/search/', {
                params: { 
                    subjectId: data.subjectId,
                    location: data.location,
                    sessionId: data.sessionId,
                    runId: data.runId,
                    runOptions: data.runOptions
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
            <Formik initialValues={initialValue} onSubmit={onSubmit} >
                <Form>
                    <div>
                       <label>Subject ID</label>
                       <Field id="subjectId" name = "subjectId" type="text"/>
                       <ErrorMessage name="subjectid" component="div" className="error"/>
                    </div>
                    <div>
                       <label>Location</label>
                       <Field id="location" name = "location" as="select">
                       <option value="A">A - Aston</option>
                       <option value="B">B - Birmingham</option>
                       <option value="N">N - Nottingham</option>
                       </Field>
                       <ErrorMessage name="location" component="div" className="error"/>
                    </div>
                    <div>
                       <label>Session ID</label>
                       <Field id="sessionId" name = "sessionId" type="text"/>
                       <ErrorMessage name="sessionid" component="div" className="error"/>
                    </div>
                    <div>
                       <label>Run ID</label>
                       <Field id="runId" name = "runId" type="text"/>
                       <ErrorMessage name="runid" component="div" className="error"/>
                    </div>
                    <div>
                       <label>Subject ID</label>
                       <label><Field id="runOptions" name = "runOptions" type="checkbox" value="rest"/>Rest</label>
                       <label><Field id="runOptions" name = "runOptions" type="checkbox" value="noise"/>Noise</label>
                       <label><Field id="runOptions" name = "runOptions" type="checkbox" value="SpAtt"/>SpAtt</label>
                       <label><Field id="runOptions" name = "runOptions" type="checkbox" value="CRT"/>CRT</label>
                       <label><Field id="runOptions" name = "runOptions" type="checkbox" value="EmoFace"/>EmoFace</label>
                       <label><Field id="runOptions" name = "runOptions" type="checkbox" value="FLAIR"/>FLAIR</label>
                       <label><Field id="runOptions" name = "runOptions" type="checkbox" value="T1W"/>T1W</label>
                       <label><Field id="runOptions" name = "runOptions" type="checkbox" value="CRT_bold"/>CRT_bold</label>
                       <label><Field id="runOptions" name = "runOptions" type="checkbox" value="CRT_events"/>CRT_events</label>
                       <ErrorMessage name="subjectid" component="div" className="error"/>
                    </div>
                    <button type="submit">Search</button>
                </Form>
            </Formik>
            <div>Results: {text} </div>
        </div>
    );

}
export default Search