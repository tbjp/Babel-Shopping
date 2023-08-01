export interface apiLanguage {
  /**
   * e.g. ES, DE, FR
   */
  language: string;
  name: string;
}

export default function azureTranslit(
  authKey: string,
  text: string,
  source: string,
  target: string
) {
  let endpoint = 'https://api.cognitive.microsofttranslator.com';

  // location, also known as region.
  // required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
  const location = 'japaneast';
  const data = [
    {
      Text: text,
    },
  ];
  return fetch(
    endpoint +
      '/translate?api-version=3.0&from=' +
      source +
      '&' +
      'to=' +
      target,
    {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': authKey,
        'Ocp-Apim-Subscription-Region': location,
        'Content-type': 'application/json',
        //'X-ClientTraceId': uuidv4().toString(),
      },
      body: JSON.stringify(data),
    }
  )
    .then((r) => r.json())
    .then((r) => r[0].translations[0].text)
    .catch((error) => {
      console.error(error);
      return 'Could not translate';
    });
}
