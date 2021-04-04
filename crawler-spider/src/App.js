import "./styles/styles.scss";
import React, { useEffect, useReducer, useState, useRef } from "react";
import { io } from "socket.io-client";
import formReducer from "./reducer/formReducer";
import { crawler } from "./server/crawler";
import ResultTable from "./components/ResultTable";
import MessageModal from "./components/MessageModal";
import WaitingSpinner from "./components/WaitingSpinner";
import CrawlerForm from "./components/CrawlerForm";
import { formValidation } from "./utils/form";
function App() {
  const [formState, formDispatch] = useReducer(formReducer, { errors: {} });
  const socketRef = useRef();
  const [pages, setPages] = useState([]);

  useEffect(() => {
    formDispatch({ type: "init" });
    socketRef.current = io(
      "http://spidercrawlerserver-env.eba-eu5p83qt.eu-west-1.elasticbeanstalk.com"
    );

    socketRef.current.on("pageFound", ({ page }) => {
      setPages((oldPages) => [...oldPages, { ...page }]);
    });

    socketRef.current.on("crawlerResultDone", (isSuccess) => {
      if (isSuccess) formDispatch({ type: "form_result_success", data: pages });
      else
        formDispatch({
          type: "form_result_failed",
          errors: {
            resultFail: true,
            message: "Problem ocurred please try again later.",
          },
        });
    });

    return () => socketRef.current.disconnect();
  }, []);

  const handleFormValidation = (form) => {
    formDispatch({ type: "start_validation" });
    const errors = formValidation(form);
    if (errors) {
      console.log(
        "🚀 ~ file: App.js ~ line 44 ~ handleFormValidation ~ errors",
        errors
      );

      formDispatch({ type: "validation_error", errors });
    } else {
      console.log(
        "🚀 ~ file: App.js ~ line 44 ~ handleFormValidation ~ errors",
        errors
      );
      formDispatch({ type: "validation_success" });
    }
  };
  const ProcessForm = async (e) => {
    e.preventDefault();
    const form = e.target;
    handleFormValidation(form);
    console.log(
      "🚀 ~ file: App.js ~ line 63 ~ ProcessForm ~ formState.isValid",
      formState.isValid
    );

    if (formState.isValid) {
      setPages([]);
      formDispatch({ type: "form_sended" });
      try {
        crawler(
          socketRef.current,
          form["url"].value,
          form["max-depth"].value,
          form["max-pages"].value
        );
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <div className="app">
      <div className="background"></div>
      <header className="App-header">
        <h1 className="title">Spider Crawler</h1>
      </header>
      <body>
        {formState.errors && formState.errors.resultFail && (
          <MessageModal
            closeFunc={() =>
              formDispatch({
                type: "init",
              })
            }
          >
            <p className="modal-content">{formState.errors.message}</p>
          </MessageModal>
        )}
        <div className="form-container">
          <CrawlerForm processForm={ProcessForm} formState={formState} />
        </div>
        <div className="result-section">
          {pages.length > 0 && (
            <ResultTable
              data={pages}
              numberOfColumns={pages.reduce(
                (max, currentPage) =>
                  max < currentPage.depth ? currentPage.depth : max,
                0
              )}
            />
          )}
        </div>
      </body>
    </div>
  );
}

export default App;
