import React, { useReducer } from "react";
import formReducer from "../reducer/formReducer";

export default ({ formState, processForm }) => {
  return (
    <form onSubmit={processForm} className="crawler-form">
      <div className="input-container">
        <label htmlFor="url-input" className="input-title">
          Url:
        </label>
        <input id="url-input" name="url" type="text" />
        {formState.errors && formState.errors.url && (
          <div className="error">page not available</div>
        )}
      </div>
      <div className="input-container">
        <label htmlFor="max-depth-input" className="input-title">
          Max depth:
        </label>
        <input id="max-depth-input" name="max-depth" type="text" />
        {formState.errors && formState.errors.maxDepth && (
          <div className="error">Needs to be a number</div>
        )}
      </div>
      <div className="input-container">
        <label htmlFor="max-pages-input" className="input-title">
          Max pages:
        </label>
        <input id="max-pages-input" name="max-pages" type="text" />
        {formState.errors && formState.errors.maxPages && (
          <div className="error">Needs to be a number</div>
        )}
      </div>
      <div className="btn-container">
        <button
          className="submit-btn"
          type="submit"
          disabled={formState.isLoading}
        >
          let the spider out
        </button>
      </div>
    </form>
  );
};
