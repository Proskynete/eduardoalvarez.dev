export const fetcher = async <P>(url: string): Promise<P> => {
  const res = await fetch(url);
  const data = await res.json();

  if (res.status !== 200) throw new Error(data.message);

  return data;
};
