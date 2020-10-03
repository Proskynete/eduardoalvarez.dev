interface ResponseInterface<T> {
  results: T | Array<T>;
}

export const fetcher = async <P>(
  url: string
): Promise<ResponseInterface<P>> => {
  const res = await fetch(url);
  const data = await res.json();

  if (res.status !== 200) throw new Error(data.message);

  return { results: data };
};
