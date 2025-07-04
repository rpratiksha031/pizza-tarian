import { Link } from "react-router-dom";

function Button({ children, disabled, to, type, onClick }) {
  const base =
    "text-sm bg-red-500 uppercase font-semibold text-white inline-block tracking-wide rounded-full " +
    "hover:bg-red-600 transition-colors duration-300 focus:outline-none focus:ring focus:ring-red-300 " +
    "focus:ring-offset-2 disabled:cursor-not-allowed";

  const styles = {
    primary: base + " md:px-6 md:py-4 py-3 px-4",
    round: base + " sm:px-3.5 sm:py-2.5 py-1 px-2 text-sm",
    small: base + " sm:px-5 sm:py-2.5 py-2 px-4 text-xs",

    secondary:
      "text-sm bg-transparent text-red-500 border-2 border-red-500 uppercase font-semibold inline-block tracking-wide " +
      "rounded-full hover:bg-red-100 transition-colors duration-300 focus:outline-none focus:ring focus:ring-red-200 " +
      "focus:ring-offset-2 disabled:cursor-not-allowed md:px-6 md:py-3.5 py-2.5 px-4 hover:text-red-700",
  };

  if (to) {
    return <Link to={to} className={styles[type]}>{children}</Link>;
  }

  return (
    <button disabled={disabled} onClick={onClick} className={styles[type]}>
      {children}
    </button>
  );
}

export default Button;
