import React from "react";

import { FaInfoCircle } from "@react-icons/all-files/fa/FaInfoCircle";
import clsx from "clsx";
import { useHotkeys } from "react-hotkeys-hook";

import type { DeepReadonly } from "ts-essentials/dist/types";

type ConfirmModalProps = DeepReadonly<{
  isOpen: boolean;
  cta: string;
  onConfirm: () => void;
  onCancel: () => void;
}>;

function ConfirmModal({ isOpen, cta, onConfirm, onCancel }: ConfirmModalProps) {
  useHotkeys("ctrl+enter", onConfirm);

  return (
    <div
      className={clsx("modal", {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "modal-open": isOpen,
      })}
    >
      <div className="modal-box">
        <div>{cta}</div>

        <div className="flex justify-between">
          <small className="flex items-end pb-1">
            {/* eslint-disable-next-line react/forbid-component-props */}
            <FaInfoCircle className="mb-1" size="0.95em" />
            &nbsp;
            <strong>Ctrl</strong>+<strong>Enter</strong>&nbsp;to confirm
          </small>
          <div className="modal-action">
            <button
              className="btn btn-primary"
              onClick={onConfirm}
              type="button"
            >
              Confirm
            </button>
            <button className="btn" onClick={onCancel} type="button">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ConfirmModal);
