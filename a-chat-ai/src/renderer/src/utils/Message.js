import { ElNotification } from 'element-plus';

let currentNotification = null; // 用于存储当前的通知

const showNotification = (msg, callback, type) => {
  // 如果当前通知和要显示的通知相同，则不显示新的
  if (currentNotification && currentNotification.message === msg && currentNotification.type === type) {
    return; // 不再显示
  }

  // 如果有当前通知，先关闭它
  if (currentNotification) {
    ElNotification.close(currentNotification);
  }

  // 创建新的通知
  const notification = ElNotification({
    title: type.charAt(0).toUpperCase() + type.slice(1),
    message: msg,
    type: type,
    duration: 2000,
    position: 'top-right',
    customClass: 'responsive-notification',
    onClose: () => {
      if (callback) {
        callback();
      }
      currentNotification = null; // 重置当前通知
    }
  });

  // 存储当前通知信息
  currentNotification = {
    message: msg,
    type: type,
    notification: notification // 存储通知对象
  };
};

const message = {
  error: (msg, callback) => {
    showNotification(msg, callback, "error");
  },
  success: (msg, callback) => {
    showNotification(msg, callback, "success");
  },
  warning: (msg, callback) => {
    showNotification(msg, callback, "warning");
  },
};

export default message;
