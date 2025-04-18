import { useTranslation } from 'react-i18next';

function useLocalization() {
  
    const { t }         =   useTranslation();

    const translate = (key: string) => {
        return t(key)
    }

    return { translate };
}

export default useLocalization;