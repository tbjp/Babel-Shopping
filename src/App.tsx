import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from 'react';
import logo from './logo.svg';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {
  Box,
  Checkbox,
  Container,
  CssBaseline,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  ThemeProvider,
  Typography,
  styled,
  Stack,
  Hidden,
  InputAdornment,
  LinearProgress,
} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import RestoreIcon from '@mui/icons-material/Restore';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { azureTranslate, azureLanguages } from './translate2';
import createBabelTheme from './theme';

// Types and Interfaces
interface Language {
  nativeLang: string;
  targetLang: string;
  translit: string;
  checked: boolean;
}

interface Settings {
  leftLang: string;
  rightLang: string;
  firstRun: string;
  darkMode: string;
}

type SettingsContextType = {
  settings: Settings;
  setSettings: (Settings: Settings) => void;
};

interface AvailableLangs {
  [key: string]: {
    name: string;
    nativeName: string;
    dir: string;
  };
}

interface LangChangeContextType {
  langChangeUseEffect: boolean;
  setLangChangeUseEffect: (newState: boolean) => void;
}

type FocusFlag = 'off' | 'left' | 'right';

type APILoading = {
  [index: number]: { left: boolean; right: boolean };
};

const defaultSettings: Settings = {
  firstRun: 'true',
  leftLang: 'en',
  rightLang: 'ja',
  darkMode: 'dark',
};

const SettingsContext = createContext<
  SettingsContextType | undefined
>(undefined);
const useSettings = () =>
  useContext(SettingsContext) as SettingsContextType;

const LangChangeContext = createContext<LangChangeContextType>({
  langChangeUseEffect: true,
  setLangChangeUseEffect: () => {},
});

const StrikethroughInput = styled(OutlinedInput)(
  ({ strikethru }: { strikethru: boolean }) => ({
    textDecoration: strikethru ? 'line-through' : 'none',
  })
);

export default function ThemedAppWrapper() {
  const [langChangeUseEffect, setLangChangeUseEffect] =
    useState(true);
  const [settings, setSettings] = useState<Settings>(() => {
    console.log('Get settings from localStorage.');
    const storedSettings = localStorage.getItem('user-settings');
    return storedSettings
      ? JSON.parse(storedSettings)
      : defaultSettings;
  });

  React.useEffect(() => {
    console.log('Write settings to localStorage.');
    localStorage.setItem('user-settings', JSON.stringify(settings));
  }, [settings]);

  const [theme, setTheme] = useState(
    createBabelTheme(settings.darkMode)
  ); // Initial theme

  useEffect(() => {
    // Update theme based on settings change
    const newTheme = createBabelTheme(settings.darkMode);
    setTheme(newTheme);
  }, [settings.darkMode]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LangChangeContext.Provider
          value={{ langChangeUseEffect, setLangChangeUseEffect }}
        >
          <App />
        </LangChangeContext.Provider>
      </ThemeProvider>
    </SettingsContext.Provider>
  );
}

function App() {
  return (
    //<SettingsContext.Provider value={{ settings, setSettings }}>
    <Container maxWidth="md">
      <Box sx={{ my: 4 }} alignItems="center" justifyContent="center">
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          textAlign={'center'}
        >
          Babel List
        </Typography>
        <SettingsPanel />
        <CheckboxList />
      </Box>
    </Container>
  );
}

function SettingsPanel() {
  const { langChangeUseEffect, setLangChangeUseEffect } =
    useContext(LangChangeContext);
  const [languageList, setLanguageList] = useState<AvailableLangs>({
    en: { name: 'English', nativeName: 'English', dir: 'ltr' },
    ja: { name: 'Japanese', nativeName: '日本語', dir: 'ltr' },
  });

  const { settings, setSettings } = useSettings();

  useEffect(() => {
    azureLanguages().then((azureList) => {
      setLanguageList(azureList.translation);
      console.log(azureList.translation);
    });
  }, []);

  const handleChange = (
    settingId: string,
    event: SelectChangeEvent
  ) => {
    const newSettings = { ...settings };
    const keyTyped = settingId as keyof typeof newSettings;
    newSettings[keyTyped] = event.target.value;
    setSettings(newSettings);
    console.log(event.target.value);
    setLangChangeUseEffect(false);
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{ pt: 1, pb: 1 }}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <FormControl size="small" fullWidth>
          <InputLabel id="l-lang">Left Language</InputLabel>
          <Select
            labelId="l-lang"
            label="Left Language"
            defaultValue={'en'}
            value={settings.leftLang}
            onChange={(e) => handleChange('leftLang', e)}
          >
            {Object.keys(languageList).map((key, i) => {
              return (
                <MenuItem value={key} key={i}>
                  {languageList[key].name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl size="small" fullWidth>
          <InputLabel id="r-lang">Right Language</InputLabel>
          <Select
            labelId="r-lang"
            label="Right Language"
            defaultValue={'ja'}
            value={settings.rightLang}
            onChange={(e) => handleChange('rightLang', e)}
          >
            {Object.keys(languageList).map((key, i) => {
              return (
                <MenuItem value={key} key={i}>
                  {languageList[key].name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
    </Container>
  );
}

function CheckboxList() {
  const { langChangeUseEffect, setLangChangeUseEffect } =
    useContext(LangChangeContext);
  const [list, setList] = useState<Language[]>(() => {
    const storedList = localStorage.getItem('user-list');
    return storedList
      ? JSON.parse(storedList)
      : [
          {
            nativeLang: 'Cheese',
            targetLang: ' ',
            translit: '',
            checked: false,
          },
          {
            nativeLang: 'Bread',
            targetLang: ' ',
            translit: '',
            checked: false,
          },
          {
            nativeLang: 'Water',
            targetLang: ' ',
            translit: '',
            checked: false,
          },
        ];
  });
  const [clearedList, setClearedList] = useState<Language[]>([
    {
      nativeLang: 'ClearedList',
      targetLang: ' ',
      translit: '',
      checked: false,
    },
  ]);
  const [showRestoreButton, setShowRestoreButton] =
    useState<boolean>(false);

  React.useEffect(() => {
    localStorage.setItem('user-list', JSON.stringify(list));
  }, [list]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [focusFlag, setFocusFlag] = useState<FocusFlag>('off');
  const { settings, setSettings } = useSettings();
  const [isAPILoading, setIsAPILoading] = useState<APILoading>({});

  // Input references for focus()
  const inputRefs = useRef<Array<HTMLTextAreaElement>>([]);
  const inputRefs2 = useRef<Array<HTMLTextAreaElement>>([]);
  const timeouts = useRef<Map<number, NodeJS.Timeout>>(new Map());

  // Set focus to new input on the correct side
  useEffect(() => {
    console.log('Focus useEffect called on ' + currentIndex);
    const index: number = currentIndex;
    switch (focusFlag) {
      case 'off':
        console.log('Focus flag is ' + focusFlag);
        break;
      case 'left':
        console.log('Focus flag is ' + focusFlag);
        inputRefs.current[index + 1]
          ?.querySelector('textarea')
          ?.focus();
        break;
      case 'right':
        console.log('Focus flag is ' + focusFlag);
        inputRefs2.current[index + 1]
          ?.querySelector('textarea')
          ?.focus();
        break;
    }
    setFocusFlag('off');
  }, [currentIndex]);

  // Clear timout so it doesn't keep running
  useEffect(() => {
    return () => {
      timeouts.current.forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  // Other functions

  const handleToggle = (index: number) => () => {
    const newList = [...list];
    newList[index].checked = !newList[index].checked;
    setList(newList);
  };

  const handleListChange = (newList: Language[]) => {
    setList(newList);
  };

  const addListItem = (prevList: Language[]) => {
    setList((prevList) => [
      ...prevList,
      {
        nativeLang: '',
        targetLang: '',
        translit: '',
        checked: false,
      },
    ]);
  };

  const removeItem = (index: number) => () => {
    setList((prevList) => {
      const newList = [...prevList];
      newList.splice(index, 1);
      return newList;
    });
  };

  const handleKeyPress = (
    event: React.KeyboardEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
    index: number,
    flag: FocusFlag
  ) => {
    // (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      console.log('Enter key pressed');
      setList((prevList) => {
        const blankLine = {
          nativeLang: '',
          targetLang: '',
          translit: '',
          checked: false,
        };
        const newList = [...prevList];
        newList.splice(index + 1, 0, blankLine);
        return newList;
      });
      setCurrentIndex(index);
      setFocusFlag(flag);
    }
  };

  const translateItem = (index: number, side: string) => () => {
    console.log('translateItem called.');

    setShowRestoreButton(false); // To stop accidental presses
    const newList = [...list];
    const item = newList[index];
    var text: string;
    var fromLang: string;
    var toLang: string;
    var reverseFlag: boolean = false;
    // Need to check if string is empty before calling.
    if (
      item.targetLang.trim() === '' &&
      item.nativeLang.trim() === ''
    ) {
      console.log('Strings are empty.');
      return;
    } else if (side === 'right' && item.targetLang.trim() !== '') {
      text = item.targetLang.trim(); // For when left input is empty
      fromLang = settings.rightLang;
      toLang = settings.leftLang;
      reverseFlag = true;
    } else if (side === 'left' && item.nativeLang.trim() !== '') {
      text = item.nativeLang.trim(); // For normal use
      fromLang = settings.leftLang;
      toLang = settings.rightLang;
    } else {
      console.log('String is empty on current side.');
      return;
    }
    setIsAPILoading((prev) => ({
      ...prev,
      [index]: { ...(prev[index] || {}), [side]: true },
    }));
    azureTranslate(text, fromLang, toLang)
      .then((x) => {
        console.log(x);
        if (x.error) {
          if (x.error === 429) {
            item.targetLang = 'Too many requests.';
            item.translit = 'Please wait 15 minutes.';
          } else if (x.error.code === 400036) {
            item.targetLang = 'Invalid target language';
            item.translit = 'Error';
          } else if (x.error.code) {
            // Handle azure error code object
            item.targetLang = x.error.code;
            item.translit = 'Error';
          } else if (x.error === 'TOOLONG') {
            console.log('Error: Input was too long.');
            item.translit = 'Please input less than 50 letters.';
            item.targetLang = 'Item too long.';
          } else {
            item.targetLang = '';
            item.translit = 'Unknown error';
          }
        } else if (reverseFlag) {
          // Missing transliteration from left side
          item.nativeLang = x[0].translations[0].text;
        } else {
          item.targetLang = x[0].translations[0].text;
          if (x[0].translations[0].transliteration) {
            item.translit = x[0].translations[0].transliteration.text;
          } else {
            item.translit = '';
          }
        }
        // This is formatted to make react queue the changes
        setList(([...list]) => [...list]);
        return x;
      })
      .finally(() => {
        setIsAPILoading((prev) => ({
          ...prev,
          [index]: { ...(prev[index] || {}), [side]: false },
        }));
        console.log(isAPILoading);
      });
  };

  const debouncedTranslate = (
    index: number,
    side: string = 'left'
  ) => {
    if (timeouts.current.has(index)) {
      clearTimeout(timeouts.current.get(index));
    }

    const newTimeout = setTimeout(translateItem(index, side), 1000);
    timeouts.current.set(index, newTimeout);
  };

  // const debouncedTranslate = (index: number) => {
  //   if (timeout.current !== null) {
  //     clearTimeout(timeout.current);
  //   }

  //   timeout.current = setTimeout(translateItem(index), 1000);
  // };

  // Translate whole list
  const translateAll = (side: string) => {
    const listArray = Array.from(
      { length: list.length },
      (_, index) => index
    );
    console.log(listArray);
    listArray.forEach((index) => {
      // Directly calling translateAll() doesn't work so call:
      debouncedTranslate(index, side);
    });
  };

  // Call translateAll every time user changes setting
  useEffect(() => {
    console.log(
      'leftLang changed, langChangeUseEffect is currently: ' +
        langChangeUseEffect
    );
    if (langChangeUseEffect === false) {
      console.log('if statement ran');
      translateAll('right');
    }
  }, [settings.leftLang]);
  useEffect(() => {
    console.log(
      'rightLang changed, langChangeUseEffect is currently: ' +
        langChangeUseEffect
    );
    if (langChangeUseEffect === false) {
      translateAll('left');
    }
    setLangChangeUseEffect(true);
  }, [settings.rightLang]);

  const clearAll = () => {
    const currentList = [...list];
    setClearedList(currentList);
    const emptyList = [
      {
        nativeLang: '',
        targetLang: '',
        translit: '',
        checked: false,
      },
    ];
    setList(emptyList);
    setShowRestoreButton(true);
  };

  const clearChecked = () => {
    const currentList = [...list];
    setClearedList(currentList);
    const filteredList = currentList.filter((item) => !item.checked);
    setList(filteredList);
    setShowRestoreButton(true);
  };

  const restoreClearedList = () => {
    const restoredList = [...clearedList];
    setList(restoredList);
    setShowRestoreButton(false);
  };

  const toggleDarkMode = () => {
    const currentSettings = { ...settings };
    if (currentSettings.darkMode === 'light') {
      currentSettings.darkMode = 'dark';
    } else {
      currentSettings.darkMode = 'light';
    }
    setSettings(currentSettings);
  };

  // const middleServerTest = () => {
  //   console.log('Middle server test button clicked');
  //   fetch('https://babel-api-relay.fly.dev/test');
  // };

  // First run useEffect. Translate example items.
  useEffect(() => {
    if (settings.firstRun === 'true') {
      debouncedTranslate(0);
      debouncedTranslate(1);
      debouncedTranslate(2);
      const newSettings = { ...settings };
      newSettings.firstRun = 'false';
      setSettings(newSettings);
    }
  }, []);

  return (
    <Stack display="flex" justifyContent="center" alignItems="center">
      <Stack sx={{ minWidth: '95%', maxWidth: 720 }}>
        <List
          sx={{
            bgcolor:
              settings.darkMode === 'light'
                ? 'primary.light'
                : 'primary.main',
            borderRadius: 2,
            boxShadow: 10,
          }}
        >
          {list.map((item, index) => {
            const labelId = `checkbox-list-label-${item.checked}`;

            return (
              <ListItem key={index} disablePadding>
                <ListItem
                  divider={true}
                  sx={{
                    pt: 0,
                    pl: 0,
                    bgcolor: item.checked ? 'primary.dark' : '',
                  }}
                  role={undefined}
                  dense
                >
                  <Stack
                    direction={'row'}
                    sx={{
                      //minWidth: '100%',
                      width: '100%',
                      maxWidth: 720,
                      //boxSizing: 'border-box',
                    }}
                  >
                    <Stack direction={'column'} sx={{ flex: 1 }}>
                      <StrikethroughInput
                        multiline
                        maxRows={2}
                        value={item.nativeLang}
                        size="small"
                        color="error"
                        sx={{
                          pt: 0,
                          pb: 0,
                          flex: 1,
                        }}
                        ref={(el) =>
                          (inputRefs.current[index] =
                            el as HTMLTextAreaElement)
                        }
                        inputProps={{
                          'aria-labelledby': labelId,
                          maxLength: 40,
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleKeyPress(e, index, 'left');
                          }
                        }}
                        strikethru={item.checked}
                        onChange={(e) => {
                          const newList = [...list];
                          newList[index].nativeLang = e.target.value;
                          handleListChange(newList);
                          debouncedTranslate(index, 'left');
                        }}
                      />
                      <Box height={3} px={1}>
                        {isAPILoading[index]?.['right'] && (
                          <LinearProgress
                            color={'secondary'}
                            sx={{ height: 3 }}
                          />
                        )}
                      </Box>
                    </Stack>
                    <Stack direction={'column'} sx={{ flex: 1 }}>
                      {/*
                    <FormControl></FormControl>
                    <InputLabel
                        htmlFor="result-input"
                        color="secondary"
                        sx={{ ml: '0.5' }}
                      >
                        {item.translit}
                      </InputLabel> */}
                      <Typography
                        textAlign={'left'}
                        variant="caption"
                        sx={{
                          ml: '1.15em',
                          mb: item.translit !== '' ? '-0.5em' : '0',
                        }}
                      >
                        {item.translit}
                      </Typography>
                      <StrikethroughInput
                        fullWidth
                        multiline
                        maxRows={2}
                        sx={{
                          pt: 0,
                          pb: 0,
                          input: {
                            textAlign: 'left',
                          },
                        }}
                        id="result-input"
                        value={item.targetLang}
                        size="small"
                        label={item.translit}
                        ref={(el) =>
                          (inputRefs2.current[index] =
                            el as HTMLTextAreaElement)
                        }
                        inputProps={{
                          'aria-labelledby': labelId,
                          maxLength: 40,
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleKeyPress(e, index, 'right');
                          }
                        }}
                        strikethru={item.checked}
                        onChange={(e) => {
                          console.log('onChange triggered:' + e);
                          const newList = [...list];
                          newList[index].targetLang = e.target.value;
                          handleListChange(newList);
                          debouncedTranslate(index, 'right');
                        }}
                      />
                      <Box height={3} px={1}>
                        {isAPILoading[index]?.['left'] && (
                          <LinearProgress
                            color={'secondary'}
                            sx={{ height: 3 }}
                          />
                        )}
                      </Box>
                    </Stack>
                  </Stack>
                  <Checkbox
                    color="default"
                    checked={item.checked}
                    onClick={handleToggle(index)}
                    tabIndex={-1}
                    inputProps={{ 'aria-labelledby': labelId }}
                    sx={{ py: 0.5, px: 1 }}
                  />
                  <IconButton
                    edge="end"
                    aria-label="comments"
                    onClick={removeItem(index)}
                    sx={{ py: 0.5, px: 1 }}
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                </ListItem>
              </ListItem>
            );
          })}
        </List>
        <Stack>
          <Stack direction="row" justifyContent="left" p={0.5}>
            <ListItem alignItems="center" disablePadding>
              <IconButton
                onClick={() => {
                  addListItem(list);
                  setCurrentIndex(list.length - 1);
                  setFocusFlag('left');
                }}
              >
                <AddCircleOutlineIcon />
              </IconButton>
              <IconButton onClick={() => clearAll()}>
                <ClearAllIcon />
              </IconButton>
              <IconButton onClick={() => clearChecked()}>
                <RemoveDoneIcon />
              </IconButton>
              <IconButton
                style={{
                  display: showRestoreButton ? 'initial' : 'none',
                }}
                onClick={() => restoreClearedList()}
              >
                <RestoreIcon />
              </IconButton>
            </ListItem>
            <Stack direction="row" justifyContent="end">
              <IconButton onClick={() => toggleDarkMode()}>
                <Brightness4Icon />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
