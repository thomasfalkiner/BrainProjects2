import React, { useState } from "react"
import axios from 'axios'
import {Formik, Form, Field, ErrorMessage} from "formik"
import * as Yup from 'yup'
import qs from 'qs'
import '../css/Search.css'
import SearchResultDisplay from "../components/SearchResultDisplay.jsx"



function Search() {
    const [text, setText] = useState('')
    const initialValue = {
        subject: '',
        session: '',
        run: '',
        location: '',
        runOptions: [],
      };

    const validationSchema = Yup.object().shape({
        subject: Yup.number('Must be a number').integer('Must be an integer').typeError("Must be a number"),
        session: Yup.number('Must be a number').integer('Must be an integer').typeError("Must be a number"),
        run: Yup.number('Must be a number').integer('Must be an integer').typeError("Must be a number")
    })

    const onSubmit = async (data, { setSubmit} ) => {
        try {
            try {
                const res = await axios.get('http://localhost:3001/search/', 
                    {
                        headers:
                        {
                            accessToken: sessionStorage.getItem("accessToken")
                        },
                        params: { 
                            subject: data.subject,
                            location: data.location,
                            session: data.session,
                            run: data.run,
                            runOptions: data.runOptions
                        },
                        paramsSerializer: params => {
                            return qs.stringify(params, { arrayFormat: 'repeat'})
                        }
                })
                    setText(res.data);
            }
            catch (err) {
                setText({message:"nothing found"})
            }


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
            <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={onSubmit}  >
                <Form>
                    <div>
                       <label>Subject number</label>
                       <Field id="subject" name = "subject" type="text"/>
                       <ErrorMessage name="subject" component="div" className="error"/>
                    </div>
                    <div>
                       <label>Location</label>
                       <Field id="location" name = "location" as="select">
                       <option value="">Choose a location</option>
                       <option value="A">A - Aston</option>
                       <option value="B">B - Birmingham</option>
                       <option value="N">N - Nottingham</option>
                       </Field>
                       <ErrorMessage name="location" component="div" className="error"/>
                    </div>
                    <div>
                       <label>Session number</label>
                       <Field id="session" name = "session" type="text"/>
                       <ErrorMessage name="session" component="div" className="error"/>
                    </div>
                    <div>
                       <label>Run number</label>
                       <Field id="run" name = "run" type="text"/>
                       <ErrorMessage name="run" component="div" className="error"/>
                    </div>
                    <div>
                       <label><Field id="runOptions" name = "runOptions" type="checkbox" value="rest"/>Rest</label>
                       <label><Field id="runOptions" name = "runOptions" type="checkbox" value="noise"/>Noise</label>
                       <label><Field id="runOptions" name = "runOptions" type="checkbox" value="spatt"/>SpAtt</label>
                       <label><Field id="runOptions" name = "runOptions" type="checkbox" value="crt"/>CRT</label>
                       <label><Field id="runOptions" name = "runOptions" type="checkbox" value="emoface"/>EmoFace</label>
                       <label><Field id="runOptions" name = "runOptions" type="checkbox" value="flair"/>FLAIR</label>
                       <label><Field id="runOptions" name = "runOptions" type="checkbox" value="t1w"/>T1W</label>
                       <label><Field id="runOptions" name = "runOptions" type="checkbox" value="crt_bold"/>CRT_bold</label>
                       <label><Field id="runOptions" name = "runOptions" type="checkbox" value="crt_events"/>CRT_events</label>
                       <ErrorMessage name="runOptions" component="div" className="error"/>
                    </div>
                    <button type="submit">Search</button>
                </Form>
            </Formik>
            <div>Results: {text && <SearchResultDisplay input = {text}/>} </div> 
        </div>
    );

}
export default Search