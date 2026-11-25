import { useCallback, useReducer } from "react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "fieldChanged":
      return { ...state, [action.field]: action.value };
    case "reset":
      return action.values;
    default:
      return state;
  }
};

const useFormState = (initialState) => {
  const [values, dispatch] = useReducer(formReducer, initialState);

  const updateField = useCallback((field, value) => {
    dispatch({ type: "fieldChanged", field, value });
  }, []);

  const handleChange = useCallback(
    (event) => updateField(event.target.name, event.target.value),
    [updateField],
  );

  const reset = useCallback((valuesToRestore) => {
    dispatch({ type: "reset", values: valuesToRestore });
  }, []);

  return { values, handleChange, updateField, reset };
};

export default useFormState;
