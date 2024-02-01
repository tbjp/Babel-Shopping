export interface apiLanguage {
  /**
   * e.g. ES, DE, FR
   */
  language: string;
  name: string;
}

export async function azureTranslate(
  text: string,
  source: string,
  target: string
): Promise<any> {
  let endpoint = 'https://api.cognitive.microsofttranslator.com';

  // location, also known as region.
  // required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
  //const location: String = 'japaneast';
  const data: Object = [
    {
      Text: text,
    },
  ];
  const fetchInfo: String =
    endpoint +
    '/translate?api-version=3.0&from=' +
    source +
    '&to=' +
    target +
    '&toScript=latn';

  const fetchObject: Object = {
    fetchInfo: fetchInfo,
    fetchBody: data,
  };

  console.log(fetchObject);

  const response = await fetch(
    'https://babel-api-relay.fly.dev/api/translate',
    {
      method: 'POST',
      body: JSON.stringify(fetchObject),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    return { error: response.status };
  }

  const translatedData = await response.json();
  return translatedData; // Return the translated data
}

export function azureLanguages() {
  return fetch(
    'https://api.cognitive.microsofttranslator.com/languages?api-version=3.0&scope=translation'
  )
    .then((r) => r.json())
    .catch((error) => {
      console.error(error);
      return 'Could not retrieve language list.';
    });
}
