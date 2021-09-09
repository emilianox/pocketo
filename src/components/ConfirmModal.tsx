import React from "react";

import clsx from "clsx";

import type { DeepReadonly } from "ts-essentials/dist/types";

type ConfirmModalProps = DeepReadonly<{
  isOpen: boolean;
  cta: string;
  onConfirm: () => void;
  onCancel: () => void;
}>;

function ConfirmModal({ isOpen, cta, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div
      className={clsx("modal", {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "modal-open": isOpen,
      })}
    >
      <div className="modal-box">
        <div>{cta}</div>

        <div className="modal-action">
          <button className="btn btn-primary" onClick={onConfirm} type="button">
            Confirm
          </button>
          <button className="btn" onClick={onCancel} type="button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ConfirmModal);
