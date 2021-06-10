const N2YO_API_KEY = "4NK7P9-N3GEDZ-9KHQ5V-4QA9";
const N2YO_API = "https://api.n2yo.com/rest/v1/satellite";
const N2YO_API_POSITION = '/positions';
const N2YO_ID_CSS = 48274;

export const CSSPosition = async () => {
  const url = `${N2YO_API}${N2YO_API_POSITION}/${N2YO_ID_CSS}/22.545369/114.056742/0/1/&apikey=${N2YO_API_KEY}`;
  let response = await fetch(url);
  response = await response.text();

  if (response) {
    const data = response;
    return {status: true, msg: null, data};
  }

  return { status: false, msg: 'request-fail', data: null };
}