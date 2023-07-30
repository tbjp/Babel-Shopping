export interface apiLanguage {
  /**
   * e.g. ES, DE, FR
   */
  language: string;
  name: string;
}

export function deepl(
  authKey: string,
  text: string,
  languages: { source: apiLanguage; target: apiLanguage }
) {
  //authKey = process.env.REACT_APP_KEY;
  const params = new URLSearchParams({
    auth_key: authKey,
    source_lang: languages.source.language,
    target_lang: languages.target.language,
    text: text,
  });
  console.log(params);
  return fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then((r) => r.json())
    .then(
      (response: {
        translations: {
          detected_source_language: string;
          text: string;
        }[];
      }) =>
        response.translations
          .map((translation) => translation.text)
          .join(' ')
    )
    .catch((error) => {
      console.error(error);
      return 'Could not translate';
    });
}

export default function azureTranslate(
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
