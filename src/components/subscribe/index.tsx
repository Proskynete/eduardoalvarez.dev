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
    <div className="">
      <h3>Suscríbete</h3>

      <form onSubmit={handleSubmit}>
        <label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Nombre"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pr-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </label>

        <label>
          <input
            id="email"
            name="email"
            type="text"
            placeholder="Correo electrónico"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pr-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </label>

        <button>Subscribirse</button>
        {response.message && <p>{response.message}</p>}
      </form>
    </div>
  );
};

export default Subscribe;
