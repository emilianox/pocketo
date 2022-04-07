import {
  useSnackbar,
  type OptionsObject,
  type SnackbarMessage,
} from "notistack";

export default function useNotify(
  message: SnackbarMessage,
  // notistack lib required not readonly
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  options?: OptionsObject
) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const onStartNotify = (msj = message) => enqueueSnackbar(msj, options);
  const onFinishNotify = () => {
    closeSnackbar(options?.key);
  };

  return { onStartNotify, onFinishNotify };
}
