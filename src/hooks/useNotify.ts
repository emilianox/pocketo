// eslint-disable-next-line prettier/prettier
import {useSnackbar, type OptionsObject, type SnackbarMessage} from "notistack";

export default function useNotify(
  message: SnackbarMessage,
  options?: OptionsObject
) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const onStartNotify = (msj = message) => enqueueSnackbar(msj, options);
  const onFinishNotify = () => {
    closeSnackbar(options?.key);
  };

  return { onStartNotify, onFinishNotify };
}

