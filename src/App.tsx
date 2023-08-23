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
  FormControl,
  Grid,
  IconButton,
  Input,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Typography,
  styled,
} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TranslateIcon from '@mui/icons-material/Translate';
import { azureTranslate, azureLanguages } from './translate';
import dotenv from 'dotenv';

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

type FocusFlag = 'off' | 'left' | 'right';

const defaultSettings: Settings = {
  leftLang: 'en',
  rightLang: 'ja',
};

const SettingsContext = createContext<
  SettingsContextType | undefined
>(undefined);
const useSettings = () =>
  useContext(SettingsContext) as SettingsContextType;

dotenv.config(); // For the secret key

const StrikethroughInput = styled(OutlinedInput)(
  ({ strikethru }: { strikethru: boolean }) => ({
    textDecoration: strikethru ? 'line-through' : 'none',
  })
);

const authKey: string = process.env.REACT_APP_AZURE as string;

export default function App() {
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

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      <Container maxWidth="md">
        <Box
          sx={{ my: 4 }}
          alignItems="center"
          justifyContent="center"
        >
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
    </SettingsContext.Provider>
  );
}

function CheckboxList() {
  const [list, setList] = useState<Language[]>(() => {
    const storedList = localStorage.getItem('user-list');
    return storedList
      ? JSON.parse(storedList)
      : [
          {
            nativeLang: 'Cheese',
            targetLang: 'チーズ',
            translit: '',
            checked: false,
          },
          {
            nativeLang: 'Milk',
            targetLang: 'ミルク',
            translit: '',
            checked: false,
          },
          {
            nativeLang: 'Chocolate',
            targetLang: 'チョコ',
            translit: '',
            checked: false,
          },
        ];
  });

  React.useEffect(() => {
    localStorage.setItem('user-list', JSON.stringify(list));
  }, [list]);

  // Input references for focus()

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [focusFlag, setFocusFlag] = useState<FocusFlag>('off');
  const { settings, setSettings } = useSettings();

  useEffect(() => {
    const index: number = currentIndex;
    switch (focusFlag) {
      case 'off':
        break;
      case 'left':
        inputRefs.current[index + 1]?.querySelector('input')?.focus();
        break;
      case 'right':
        inputRefs2.current[index + 1]
          ?.querySelector('input')
          ?.focus();
        break;
    }
    setFocusFlag('off');
  }, [currentIndex, focusFlag]);

  const inputRefs = useRef<Array<HTMLInputElement>>([]);
  const inputRefs2 = useRef<Array<HTMLInputElement>>([]);
  const inputRefs3 = useRef<Array<HTMLInputElement>>([]);

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

  const handleKeyPress =
    (index: number, flag: FocusFlag) =>
    (event: React.KeyboardEvent<HTMLInputElement>) => {
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

  const translateItem = (index: number) => () => {
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
      return;
    } else if (item.nativeLang.trim() === '') {
      text = item.targetLang.trim(); // For when left input is empty
      fromLang = settings.rightLang;
      toLang = settings.leftLang;
      reverseFlag = true;
    } else {
      text = item.nativeLang.trim(); // For normal use
      fromLang = settings.leftLang;
      toLang = settings.rightLang;
    }
    azureTranslate(authKey, text, fromLang, toLang).then((x) => {
      console.log(x);
      if (x.error) {
        // Handle no transliteration.
        item.targetLang = 'Language pair not available.';
        item.translit = '';
      } else if (reverseFlag) {
        item.nativeLang = x[0].translations[0].text;
      } else {
        item.targetLang = x[0].translations[0].text;
        if (x[0].translations[0].transliteration) {
          item.translit = x[0].translations[0].transliteration.text;
        } else {
          item.translit = '';
        }
      }
      newList.splice(index, 1, item);
      setList(newList);
      return x;
    });
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <List
        sx={{
          width: 'fit-content',
          maxWidth: 720,
          bgcolor: 'background.paper',
        }}
      >
        {list.map((item, index) => {
          const labelId = `checkbox-list-label-${item.checked}`;

          return (
            <ListItem key={index} disablePadding>
              <ListItem role={undefined} dense>
                <StrikethroughInput
                  value={item.nativeLang}
                  size="small"
                  //autoFocus={true}
                  ref={(el) =>
                    (inputRefs.current[index] =
                      el as HTMLInputElement)
                  }
                  inputProps={{ 'aria-labelledby': labelId }}
                  onKeyPress={handleKeyPress(index, 'left')}
                  strikethru={item.checked}
                  onChange={(e) => {
                    const newList = [...list];
                    newList[index].nativeLang = e.target.value;
                    handleListChange(newList);
                  }}
                />
                <FormControl>
                  <InputLabel htmlFor="result-input">
                    {item.translit}
                  </InputLabel>
                  <StrikethroughInput
                    id="result-input"
                    value={item.targetLang}
                    size="small"
                    label={item.translit}
                    ref={(el) =>
                      (inputRefs2.current[index] =
                        el as HTMLInputElement)
                    }
                    inputProps={{ 'aria-labelledby': labelId }}
                    onKeyPress={handleKeyPress(index, 'right')}
                    strikethru={item.checked}
                    onChange={(e) => {
                      const newList = [...list];
                      newList[index].targetLang = e.target.value;
                      handleListChange(newList);
                    }}
                  />
                </FormControl>
                <Checkbox
                  checked={item.checked}
                  onClick={handleToggle(index)}
                  tabIndex={-1}
                  inputProps={{ 'aria-labelledby': labelId }}
                />
                <IconButton
                  edge="end"
                  aria-label="comments"
                  onClick={removeItem(index)}
                >
                  <RemoveCircleOutlineIcon />
                </IconButton>
                <IconButton onClick={translateItem(index)}>
                  <TranslateIcon />
                </IconButton>
              </ListItem>
            </ListItem>
          );
        })}
        <ListItem alignItems="center">
          <IconButton onClick={() => addListItem(list)}>
            <AddCircleOutlineIcon />
          </IconButton>
          <IconButton
            onClick={() =>
              azureTranslate(authKey, 'text', 'en', 'ja')
            }
          >
            <TranslateIcon />
          </IconButton>
        </ListItem>
      </List>
    </Box>
  );
}

function SettingsPanel() {
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
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <FormControl>
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
      <FormControl>
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
  );
}
