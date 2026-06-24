import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@react-ui-org/react-ui';
import {Button } from '@react-ui-org/react-ui';
import {GlobalPropsProvider} from '@react-ui-org/react-ui'
import React from 'react'

function Alert({isOpen, message, isDelete, isClose}){
     const modalPrimaryButtonRef = React.useRef();
  const modalCloseButtonRef = React.useRef();

  return (
    <GlobalPropsProvider globalProps={{
      Modal: { preventScrollUnderneath: window.document.documentElement }
    }}>
      <div>
        {isOpen && (
          <Modal
            closeButtonRef={modalCloseButtonRef}
            primaryButtonRef={modalPrimaryButtonRef}
          >
            <ModalHeader>
              <ModalTitle>Delete the user?</ModalTitle>
              <ModalCloseButton onClick={() => isClose(false)} />
            </ModalHeader>
            <ModalBody>
              <ModalContent>
                <p>
                  Do you really want to delete the task <code>{message}</code>?
                  This cannot be undone.
                </p>
              </ModalContent>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                label="Delete"
                onClick={() => isDelete()}
                ref={modalPrimaryButtonRef}
              />
              <Button
                label="Close"
                onClick={() => isClose(false)}
                priority="outline"
                ref={modalCloseButtonRef}
              />
            </ModalFooter>
          </Modal>
        )}
      </div>
    </GlobalPropsProvider>
  );
}

export default Alert;