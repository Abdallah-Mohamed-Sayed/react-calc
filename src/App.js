import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      if (payload.digit === "." && !state.currentOperand) {
        return {
          ...state,
          currentOperand: `0.`,
        };
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }
      if (state.overwrite) {
        return { ...state, currentOperand: payload.digit, overwrite: false };
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand === null && state.previousOperand === null) {
        return state;
      }

      if (state.previousOperand === null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
          overwrite: false,
        };
      }

      if (state.currentOperand != null) {
        return {
          ...state,
          previousOperand: evaluate(state),
          operation: payload.operation,
          currentOperand: null,
        };
      }

      return {
        ...state,
        operation: payload.operation,
      };

    case ACTIONS.EVALUATE:
      if (
        state.operation === null ||
        state.previousOperand === null ||
        state.currentOperand === null
      )
        return state;

      return {
        ...state,
        overwrite: true,
        currentOperand: evaluate(state),
        previousOperand: null,
        operation: null,
      };

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }

      if (!state.currentOperand) return state;

      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    case ACTIONS.CLEAR:
      return {
        currentOperand: null,
        previousOperand: null,
        operation: null,
      };

    default:
      return state;
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";

  switch (operation) {
    case "+":
      return (prev + current).toString();
    case "-":
      return (prev - current).toString();
    case "×":
      return (prev * current).toString();
    case "÷":
      return current === 0 ? "Error" : (prev / current).toString();
    default:
      return "";
  }
}

function formatOperand(operand) {
  if (operand == null) return "";
  const [integer, decimal] = operand.toString().split(".");
  if (decimal !== undefined) {
    return `${parseInt(integer).toLocaleString("en-US")}.${decimal}`;
  } else if (operand.includes(".")) {
    return `${parseInt(integer).toLocaleString("en-US")}.`;
  } else {
    return parseInt(integer).toLocaleString("en-US");
  }
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {
      currentOperand: null,
      previousOperand: null,
      operation: null,
    }
  );

  const handleButtonClick = (actionType) => () =>
    dispatch({ type: actionType });

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={handleButtonClick(ACTIONS.CLEAR)}>
        AC
      </button>
      <button onClick={handleButtonClick(ACTIONS.DELETE_DIGIT)}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="×" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={handleButtonClick(ACTIONS.EVALUATE)}
      >
        =
      </button>
    </div>
  );
}

export default App;
