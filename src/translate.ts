export interface DeeplLanguage {
  /**
   * e.g. ES, DE, FR
   */
  language: string;
  name: string;
}

export default function deepl(
  authKey: string,
  text: string,
  languages: { source: DeeplLanguage; target: DeeplLanguage }
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
