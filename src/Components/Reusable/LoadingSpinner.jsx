import React from "react";

const LoadingSpinner = ({ centered = false, message = "Loading..." }) => {
  const wrapperClass = centered
    ? "min-h-screen flex flex-col items-center justify-center px-4 py-8 space-y-4"
    : "flex flex-col items-center justify-center py-4 space-y-3";

  return (
    <div className={wrapperClass}>
      <div
        className="h-[5px] w-[5px] animate-[cubeLoader_6s_linear_infinite]"
        style={{
          color: "#169698",
          boxShadow:
            "-10px -10px 0 5px #169698, -10px -10px 0 5px #169698, -10px -10px 0 5px #169698, -10px -10px 0 5px #169698",
        }}
      ></div>

      {/* Optional text below spinner */}
      {message && (
        <p className="text-sm font-medium text-gray-600 tracking-wide">
          {message}
        </p>
      )}

      {/* Inline keyframes for animation */}
      <style>{`
        @keyframes cubeLoader {
          0% { box-shadow: -10px -10px 0 5px #169698, -10px -10px 0 5px #169698, -10px -10px 0 5px #169698, -10px -10px 0 5px #169698; }
          8.33% { box-shadow: -10px -10px 0 5px #169698, 10px -10px 0 5px #169698, 10px -10px 0 5px #169698, 10px -10px 0 5px #169698; }
          16.66% { box-shadow: -10px -10px 0 5px #169698, 10px -10px 0 5px #169698, 10px 10px 0 5px #169698, 10px 10px 0 5px #169698; }
          24.99% { box-shadow: -10px -10px 0 5px #169698, 10px -10px 0 5px #169698, 10px 10px 0 5px #169698, -10px 10px 0 5px #169698; }
          33.32% { box-shadow: -10px -10px 0 5px #169698, 10px -10px 0 5px #169698, 10px 10px 0 5px #169698, -10px -10px 0 5px #169698; }
          41.65% { box-shadow: 10px -10px 0 5px #169698, 10px -10px 0 5px #169698, 10px 10px 0 5px #169698, 10px -10px 0 5px #169698; }
          49.98% { box-shadow: 10px 10px 0 5px #169698, 10px 10px 0 5px #169698, 10px 10px 0 5px #169698, 10px 10px 0 5px #169698; }
          58.31% { box-shadow: -10px 10px 0 5px #169698, -10px 10px 0 5px #169698, 10px 10px 0 5px #169698, -10px 10px 0 5px #169698; }
          66.64% { box-shadow: -10px -10px 0 5px #169698, -10px -10px 0 5px #169698, 10px 10px 0 5px #169698, -10px 10px 0 5px #169698; }
          74.97% { box-shadow: -10px -10px 0 5px #169698, 10px -10px 0 5px #169698, 10px 10px 0 5px #169698, -10px 10px 0 5px #169698; }
          83.3% { box-shadow: -10px -10px 0 5px #169698, 10px 10px 0 5px #169698, 10px 10px 0 5px #169698, -10px 10px 0 5px #169698; }
          91.63% { box-shadow: -10px -10px 0 5px #169698, -10px 10px 0 5px #169698, -10px 10px 0 5px #169698, -10px 10px 0 5px #169698; }
          100% { box-shadow: -10px -10px 0 5px #169698, -10px -10px 0 5px #169698, -10px -10px 0 5px #169698, -10px -10px 0 5px #169698; }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
