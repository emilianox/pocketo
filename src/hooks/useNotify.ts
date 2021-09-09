import { useSnackbar } from "notistack";

import type { OptionsObject, SnackbarMessage } from "notistack";

export default function useNotify(
  message: SnackbarMessage,
  options?: OptionsObject
) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const onStartNotify = () => enqueueSnackbar(message, options);
  const onFinishNotify = () => {
    closeSnackbar(options?.key);
  };

  return { onStartNotify, onFinishNotify };
}
