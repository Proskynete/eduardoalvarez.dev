import { useState } from "react";

const Subscribe = () => {
  const [response, setResponse] = useState({ status: 0, message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const response = await fetch("/api/subscribe", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.message) {
      setResponse({ message: data.message, status: data.status });
    }
  };

  return (
    <div>
      <div className="pb-1 ">
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Suscríbete a mi newsletter
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          Para recibir actualizaciones sobre nuevos artículos y otros
          contenidos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row mt-2">
        <label>
          <span className="sr-only">Tu nombre</span>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Nombre"
            className="focus:ring-primary-600 w-72 rounded-md px-4 focus:border-transparent focus:outline-none focus:ring-2 dark:bg-black"
          />
        </label>

        <label className="mt-2 sm:mt-0 sm:ml-3">
          <span className="sr-only">Tu correo electrónico</span>
          <input
            id="email"
            name="email"
            type="text"
            placeholder="Correo electrónico"
            className="focus:ring-primary-600 w-72 rounded-md px-4 focus:border-transparent focus:outline-none focus:ring-2 dark:bg-black"
          />
        </label>

        <div className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:ml-3">
          <button className="bg-primary-500 w-full rounded-md py-2 px-4 font-medium text-white sm:py-0 hover:bg-primary-700 dark:hover:bg-primary-400 focus:ring-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-black">
            Subscribirse
          </button>
        </div>
      </form>
      {response.message && (
        <p
          className={`mt-2 text-sm ${
            response.status === 200
              ? "text-green-500 dark:text-green-400"
              : "text-red-500 dark:text-red-400"
          }`}
        >
          {response.message}
        </p>
      )}
    </div>
  );
};

export default Subscribe;
