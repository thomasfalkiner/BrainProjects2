import React, { useState } from "react"
import axios from 'axios'
import {Formik, Form, Field, ErrorMessage} from "formik"
import * as Yup from 'yup'
import qs from 'qs'
import '../css/Search.css'
import SearchResultDisplay from "../components/SearchResultDisplay.jsx"

function extractLowestLevelData(response) {
    const { branch, data } = response;
    if (!data || !data.length) return [];
  
    switch (branch) {
      case "subject":
        return data.map(subject => ({
          ...subject,
          Sessions: subject.Sessions?.map(session => ({
            ...session,
            Runs: session.Runs?.map(run => ({ ...run }))
          }))
        }));
  
      case "session":
        return data[0]?.Sessions?.map(session => ({
          ...session,
          Runs: session.Runs?.map(run => ({ ...run }))
        })) || [];
  
      case "run":
        return (
          data[0]?.Sessions?.[0]?.Runs?.map(run => ({
            ...run
          })) || []
        );
  
      case "runOptions":
        return (
          data[0]?.Sessions?.[0]?.Runs?.map(run => {
            const validOptions = [
              "rest", "noise", "spatt", "crt", "emoface", "flair",
              "t1w", "crt_bold", "crt_events"
            ];
            const filtered = {};
            validOptions.forEach(opt => {
              if (opt in run) filtered[opt] = run[opt];
            });
            return filtered;
          }) || []
        );
  
      default:
        return [];
    }
  }

function Search() {
    const [text, setText] = useState('')
    const initialValue = {
        subjectId: '',
        sessionId: '',
        run: '',
        location: '',
        runOptions: [],
      };

    const validationSchema = Yup.object().shape({
        subjectId: Yup.number('Must be a number').integer('Must be an integer').typeError("Must be a number"),
        sessionId: Yup.number('Must be a number').integer('Must be an integer').typeError("Must be a number"),
        run: Yup.number('Must be a number').integer('Must be an integer').typeError("Must be a number")
    })

    const onSubmit = async (data, { setSubmit} ) => {
        try {

            const res = await axios.get('http://localhost:3001/search/', 
                {
                    headers:
                    {
                        accessToken: sessionStorage.getItem("accessToken")
                     },
                     params: { 
                        subjectId: data.subjectId,
                        location: data.location,
                        sessionId: data.sessionId,
                        run: data.run,
                        runOptions: data.runOptions
                    },
                    paramsSerializer: params => {
                        return qs.stringify(params, { arrayFormat: 'repeat'})
                    }
              })
            setText(JSON.stringify(extractLowestLevelData(res.data),null,2))

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
                       <label>Subject ID</label>
                       <Field id="subjectId" name = "subjectId" type="text"/>
                       <ErrorMessage name="subjectId" component="div" className="error"/>
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
                       <label>Session ID</label>
                       <Field id="sessionId" name = "sessionId" type="text"/>
                       <ErrorMessage name="sessionId" component="div" className="error"/>
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