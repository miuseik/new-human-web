import { ElMessageBox } from 'element-plus'
let messageBoxStatus = true
/**
 * MessageBox
 * @param title
 * @param message
 * @param dangerouslyUseHTMLString
 * @param confirmText
 * @param showCancelBtn
 * @param cancelText
 * @param showConfirmBtn
 * @param autoClose
 * @param delayedCloseTime
 * @param confirmCallBack
 * @param cancelCallBack
 * @param autoCloseCallBack
 */
export const messageBox = ({
  title = 'Notice',
  message = '',
  dangerouslyUseHTMLString = false,
  confirmText = 'Confirm',
  showCancelBtn = false,
  cancelText = 'Cancel',
  showConfirmBtn = true,
  autoClose = false,
  delayedCloseTime = 1500,
  confirmCallBack = null,
  cancelCallBack = null,
  autoCloseCallBack = null
}) => {
  if (!messageBoxStatus) return
  messageBoxStatus = false
  const options = {
    title,
    message: message,
    dangerouslyUseHTMLString: dangerouslyUseHTMLString,
    showConfirmButton: showConfirmBtn,
    showCancelButton: showCancelBtn,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonClass: 'popConfirmBtn',
    cancelButtonClass: 'popCancelBtn',
    showClose: false,
    center: true,
    closeOnClickModal: false,
    closeOnPressEscape: false
  }
  if (showConfirmBtn && showCancelBtn) {
    options.customClass = 'popBox'
  }
  ElMessageBox(options)
    .then(action => {
      messageBoxStatus = true
      if (confirmCallBack) confirmCallBack()
    })
    .catch(() => {
      messageBoxStatus = true
      if (cancelCallBack) cancelCallBack()
    })
  if (autoClose && !messageBoxStatus) {
    setTimeout(() => {
      ElMessageBox.close()
      messageBoxStatus = true
      if (autoCloseCallBack) autoCloseCallBack()
    }, delayedCloseTime)
  }
}

/**
 * MessageBox Success Auto Close
 * @param message
 * @param autoCloseCallBack
 */
export const messageBoxSuccessAutoClose = (
  message = '',
  autoCloseCallBack = null
) => {
  messageBox({
    title: 'Success',
    message: message,
    showConfirmBtn: false,
    autoClose: true,
    autoCloseCallBack: autoCloseCallBack
  })
}

/**
 * MessageBox Warning Confirm
 * @param message
 * @param confirmCallBack
 */
export const messageBoxWarningConfirm = (
  message = '',
  confirmCallBack = null
) => {
  messageBox({
    title: 'Warning',
    message: message,
    confirmCallBack: confirmCallBack
  })
}

/**
 * MessageBox Warning Confirm HTML
 * @param message
 * @param confirmCallBack
 */
export const messageBoxWarningConfirmHtml = (
  message = '',
  confirmCallBack = null
) => {
  messageBox({
    title: 'Warning',
    message: message,
    dangerouslyUseHTMLString: true,
    confirmCallBack: confirmCallBack
  })
}

/**
 * MessageBox Notice Confirm And Cancel
 * @param message
 * @param confirmCallBack
 * @param cancelCallBack
 */
export const messageBoxNoticeConfirmAndCancel = (
  message = '',
  confirmCallBack = null,
  cancelCallBack = null
) => {
  messageBox({
    title: 'Notice',
    message: message,
    showCancelBtn: true,
    confirmCallBack: confirmCallBack,
    cancelCallBack: cancelCallBack
  })
}

/**
 * MessageBox Warning Auto Close
 * @param message
 * @param autoCloseCallBack
 */
export const messageBoxWarningAutoClose = (
  message = '',
  autoCloseCallBack = null
) => {
  messageBox({
    title: 'Warning',
    message: message,
    showConfirmBtn: false,
    autoClose: true,
    autoCloseCallBack: autoCloseCallBack
  })
}
