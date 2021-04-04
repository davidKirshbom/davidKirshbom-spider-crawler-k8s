export default (state, action) => {
  switch (action.type) {
    case "start_validation":
      return { ...state, isLoading: true, errors: undefined, isValid: false };
    case "validation_error":
      return {
        ...state,
        isLoading: false,
        errors: action.errors,
        isValid: false,
      };
    case "validation_success":
      return { ...state, isLoading: false, isValid: true, errors: undefined };
    case "form_sended":
      return { ...state, isLoading: true, data: undefined };
    case "form_result_success":
      return { ...state, isLoading: false, data: action.data };
    case "form_result_failed":
      return {
        ...state,
        isLoading: false,
        data: undefined,
        errors: action.errors,
      };
    case "init":
      return {
        isLoading: false,
        data: undefined,
        errors: undefined,
        isValid: true,
      };
    default:
      throw new Error("no such action");
  }
};
